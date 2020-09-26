import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ShopifyService } from '../../../shopify/shopify.service'
import { RulesService } from '../../../rules/rules.service'
import { SuppliersService } from '../../../suppliers/suppliers.service'

//moment
import * as moment from 'moment';

@Processor('chronos')
export class ChronosProcessor {

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly rulesService: RulesService,
    private readonly suppliersService: SuppliersService
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

       }

       

    }       
    
  }

}