const static = require('./static');
const {accounts} = require('../config/mongoCollections');
const { level } = require('../lib/Check');

/**
 * get the organzation data from collection
 * @returns {_id,name,department,position,level}
 */
const getOrganzation = async()=>{
    const accountInfo = await accounts();
    const departmentInfo=await static.getStaticData("departments");
    const positionInfo=await static.getStaticData("positions");
    const accountList=await accountInfo.find({}, { projection: {
         _id: 1, 
         firstName: 1,
         lastName: 1,
         department: 1,
         position: 1
        } 
    }).toArray();

    let accountData =accountList.map(account=>{
        let depart="";
        let pos="";
        let level="";
        let val=0;
        
        departmentInfo.map((value,index)=>{
            if(account.department===value._id){
                depart=value.name;
            }
        })

        
        positionInfo.map((value,index)=>{
            if(account.position===value._id){
                pos=value.name;
                level=value.level;
                val=5-parseInt(value.level);
            }
        })

        return {
            _id: account._id, 
            name: account.firstName+" "+account.lastName,
            department: depart,
            position: pos,
            level: level,
            value: val
        } 
    });

    let managerList=[];
    const color=["red","blue","green","yellow","pink"];
    let idx=0;
    for(let i of accountData){
        if(parseInt(i.level)==0){
            i["children"]=[];
            let itemStyle={"color" : color[idx]};
            i["itemStyle"]=itemStyle;
            managerList.push(i);
            idx++;
        }
    }

    accountData.map(account=>{
        if(parseInt(account.level)>0){
            managerList.map((value)=>{
                if(value.department==account.department){
                    let itemStyle={"color" : value.itemStyle.color};
                    account["itemStyle"]=itemStyle;
                    value.children.push(account);
                }
            })
        }
    });

    return managerList;
};



module.exports = {
	getOrganzation
};