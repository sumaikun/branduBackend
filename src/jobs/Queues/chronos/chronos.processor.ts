import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ShopifyService } from '../../../shopify/shopify.service'
import { RulesService } from '../../../rules/rules.service'
import { SuppliersService } from '../../../suppliers/suppliers.service'
import { ProductTraceService } from '../../../productTrace/productTrace.service'
import { ProductBackupService } from '../../../backups/backups.service'

//moment
import * as moment from 'moment';

@Processor('chronos')
export class ChronosProcessor {

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly rulesService: RulesService,
    private readonly suppliersService: SuppliersService,
    private readonly productTraceService: ProductTraceService,
    private readonly productBackupService: ProductBackupService
  ){}

  private readonly logger = new Logger(ChronosProcessor.name);

  @Process('test')
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }

  @Process('checkChronos')
  async checkChronos(job: Job) {
    this.logger.debug("lets check metrics")
    console.log("job",job.data)

    let errorCount = 0
    let successCount = 0

    if(job.data.automatical)
    {

       const jobSupplier = await this.suppliersService.findOne(job.data.supplier)

       //console.log("jobSupplier",jobSupplier)

       if(jobSupplier){

        console.log("ready to change products")

        const totalProducts = await this.shopifyService.getAll()
        
        this.logger.debug("totalProducts.length() : "+totalProducts.products.length)
        //console.log("totalProducts.length()",totalProducts.products.length)

        const supplierProducts = totalProducts.products.filter( product => product.vendor ===  jobSupplier.vendorId )

        //console.log("supplierProducts.length",supplierProducts.length)

        this.logger.debug("supplierProducts.length() : "+supplierProducts.length)

        const rulesFixedData = await this.rulesService.executeRulesOnData( { rules: job.data.rules, exampleData: supplierProducts } )

        //console.log("rulesFixedData",rulesFixedData)

        const dataToEdit = rulesFixedData.filter( data => data.mode )

        //console.log("dataToEdit",dataToEdit)

        //console.log("dataToEdit.length",dataToEdit.length)
        this.logger.debug("dataToEdit.length() : "+dataToEdit.length)

        for (let index = 0; index < dataToEdit.length; index++) {

            let data = dataToEdit[index]

            const originalData = rulesFixedData.filter( subdata => subdata.id === data.originalId )[0]

            //console.log("originalData",originalData)          

            data.id = data.originalId

            if( (index + 1) % 20 == 0 ){
                this.logger.debug("wait")
                //console.log("wait")
                await this.sleep(3000)
            }
    
            if( (index + 1) % 125 == 0 ){
                this.logger.debug("wait longer")
                //console.log("wait")
                await this.sleep(5000)
            
            }           

            const response = this.shopifyService.updateProduct(data.id,{product:data}).then(
              async response => {
                //console.log("done")

                //console.log("response",response)
    
                if(response.status === 200 && originalData)
                {

                    successCount++
                    this.logger.debug("successCount: "+successCount)
                    let day = moment().format('YYYY/MM/DD');
    
                    let tomorrow = moment().add(1,'d').format('YYYY/MM/DD');
    
                    const traces = await this.productTraceService.findBetweenDatesWithID(new Date(day),new Date(tomorrow),data.id)
    
                    if(traces.length > 0)
                    {
                        this.productTraceService.update(traces[0].id,{product:originalData})
                    }
                    else{
                        this.productTraceService.create({shopifyId:originalData.id,
                          supplier:job.data.supplier,
                          chronos:job.data.id,
                          shopifyProduct:{product:originalData}
                        })  
                    }          
                }
              }
            ).catch( error =>  {
              errorCount++
              this.logger.debug("errorCount: "+errorCount)
          })

          await this.sleep(340)           
           
        }
       }   

    }       
    
  }

  @Process('massiveUpdate')
  async massiveUpdate(job: Job) {
    const data = job.data
    let errorCount = 0
    let successCount = 0
    for (let index = 0; index < data.length; index++) {
        const trace = await this.productTraceService.findOne(data[index])
        //console.log("trace",trace)
        //console.log("process")   
        //await this.sleep(10)            
        if( (index + 1) % 20 == 0 ){
            //this.logger.debug("wait")
            //console.log("wait")
            await this.sleep(3000)
        }

        if( (index + 1) % 125 == 0 ){
            //this.logger.debug("wait longer")
            //console.log("wait")
            await this.sleep(5000)
        
        }
        
        if(trace){
            this.shopifyService.updateProduct(trace.shopifyId,trace.shopifyProduct).then( ok => { 
                successCount++
                this.logger.debug("successCount: "+successCount)
                //console.log("successCount",successCount) 
            })
            .catch( error =>  {
                errorCount++
                this.logger.debug("errorCount: "+errorCount)
                //console.log("errorCount",errorCount)
            })
            //console.log("done")
            await this.sleep(340)
        }        
    }
                 
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @Process('makeBackup')
  async makeBackup(job: Job) {
    this.logger.debug("makeBackup")
    const totalProducts = await this.shopifyService.getAll()
    this.logger.debug("makeBackup products got")
    for (let index = 0; index < totalProducts.products.length; index++) {

      //this.logger.debug(index+"-"+totalProducts.products[index].id)
      await this.productBackupService.create({ shopifyId: totalProducts.products[index].id, shopifyProduct: totalProducts.products[index]})
    }
  }


  @Process('restoreBackup')
  async restoreBackup(job: Job) {
    const data = job.data
    let errorCount = 0
    let successCount = 0
    for (let index = 0; index < data.length; index++) {
              
        if( (index + 1) % 20 == 0 ){
            //this.logger.debug("backup wait")
            //console.log("wait")
            await this.sleep(3000)
        }

        if( (index + 1) % 125 == 0 ){
            //this.logger.debug("backup wait longer")
            //console.log("wait")
            await this.sleep(5000)
        
        }        
       
        this.shopifyService.updateProduct(data[index].shopifyId,data[index].shopifyProduct).then( ok => { 
            successCount++
            this.logger.debug("backup successCount: "+successCount)
            //console.log("successCount",successCount) 
        })
        .catch( error =>  {
            errorCount++
            this.logger.debug("backup errorCount: "+errorCount)
            //console.log("errorCount",errorCount)
        })
        //console.log("done")
        await this.sleep(340)
               
    }
                 
  }

}



//800704240
