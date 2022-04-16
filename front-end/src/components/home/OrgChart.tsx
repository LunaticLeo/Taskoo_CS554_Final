import React, { useEffect, useLayoutEffect, useState } from 'react';
import Chart, { Option } from '@/components/widgets/Chart';
import { CardContent, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

var orgdata :any;
async function fetchData() {
    try {
        const { data }  = await axios.get('/api1/organzation');
        orgdata=data.data;
    } catch (e) {
        console.log(e);
    }
}

const OrgChart: React.FC = () => {
	const { t } = useTranslation();
	const [option, setOption] = useState<Option>({});
    const [flag,setFlag] = useState(false);
    var timer :any;
    fetchData();
	useLayoutEffect(() => {
    clearInterval(timer);
    timer=setInterval(function () {
        clearInterval(timer);
        setFlag(!flag);
    }, 5000);
        if(flag){
            setOption(
                treemapOption({
                    data: orgdata
                })
            );
                
        }else{
            setOption(
                sunburstOption({
                    data: orgdata
                })
            );
        }
	}, [flag]);
	return (
		<Chart height='230px' width='400px' option={option} />
	);
};

const treemapOption = ({data}: treemapOption): Option => {
      console.log("treemap");
      return {
        series: [
            {
              type: 'treemap',
              id: 'echarts-package-size',
              animationDurationUpdate: 1000,
              roam: false,
              nodeClick: "zoomToNode",
              data: data,
              universalTransition: true,
              label: {
                show: true
              },
              breadcrumb: {
                show: false
              }
            }
          ]
    };
};


const sunburstOption = ({data}: sunburstOption): Option => {
      return {
        series: [
            {
              type: 'sunburst',
              id: 'echarts-package-size',
              radius: ['20%', '90%'],
              animationDurationUpdate: 1000,
              nodeClick: undefined,
              data: data,
              universalTransition: true,
              itemStyle: {
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,.5)',
                color: 'red'
              },
              label: {
                show: true
              }
            }
          ]
    };
};

interface treemapOption {
	data : any;
}

interface sunburstOption {
	data : any;
}


export default OrgChart;
