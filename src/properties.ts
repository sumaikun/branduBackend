export class properties{

    //singleton instance
    private static _instance : properties;
    private dataToPersist: any;
    private cb:any;

    private logoutAction:any;

    private constructor(){
       
    }

    public getDataToPersist(){
        return this.dataToPersist;
    }

    public getCb(){
        return this.cb;
    }

    public getLogoutAction(){
        return this.logoutAction
    }

    public static getInstance(){        
        if(!this._instance)
        {
            this._instance = new this();
            return this._instance;
        }
        return this._instance;
    }    

    public static setDataToPersist(dataToPersist){
        this.getInstance().dataToPersist = dataToPersist;
    }

    public static addCb(cb){
        this.getInstance().cb = cb;
    }


}

