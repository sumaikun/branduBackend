import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ShopifyService } from '../../../shopify/shopify.service'
import { RulesService } from '../../../rules/rules.service'
import { SuppliersService } from '../../../suppliers/suppliers.service'
import { ProductTraceService } from '../../../productTrace/productTrace.service'

//moment
import * as moment from 'moment';

@Processor('chronos')
export class ChronosProcessor {

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly rulesService: RulesService,
    private readonly suppliersService: SuppliersService,
    private readonly productTraceService: ProductTraceService
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
    if(job.data.automatical)
    {

       const jobSupplier = await this.suppliersService.findOne(job.data.supplier)

       console.log("jobSupplier",jobSupplier)

       if(jobSupplier){

        console.log("ready to change products")

        const totalProducts = await this.shopifyService.getAll()
 
        console.log("totalProducts.length()",totalProducts.products.length)

        const supplierProducts = totalProducts.products.filter( product => product.vendor ===  jobSupplier.vendorId )

        console.log("supplierProducts.length",supplierProducts.length)

        const rulesFixedData = await this.rulesService.executeRulesOnData( { rules: job.data.rules, exampleData: supplierProducts } )

        //console.log("rulesFixedData",rulesFixedData)

        const dataToEdit = rulesFixedData.filter( data => data.mode )

        //console.log("dataToEdit",dataToEdit)

        dataToEdit.map( async data => {
          const originalData = rulesFixedData.filter( subdata => subdata.id === data.originalId )[0]

          //console.log("originalData",originalData)          

          data.id = data.originalId

          this.shopifyService.updateProduct(data.id,{product:data}).then( async response => {

            //console.log("update response",response)

            if(response.status === 200 && originalData)
            {
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

          }).catch( error => console.error(error) )

          

        })

       }

       

    }       
    
  }

}

//800704240