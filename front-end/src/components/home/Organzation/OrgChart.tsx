import React, { useEffect,useCallback, useLayoutEffect, useState } from 'react';
import Chart from '@/components/widgets/Chart';
import { CardContent, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import { Option } from '@/@types/props';
import http from '@/utils/http';


const OrgChart: React.FC = () => {
	const { t } = useTranslation();
	const [option, setOption] = useState<Option>({});
    const [flag,setFlag] = useState(false);
    var timer :any;
    const [data, setData] = useState<ProjectInfo[]>([]);
    const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];
    useEffect(() => {
		getProjectList();
	}, []);
    const getProjectList = useCallback(() => {
		http.get<ProjectInfo[]>('/organzation').then(res => {
			setData(res.data!);
		});
	}, []);

	useLayoutEffect(() => {
    clearInterval(timer);
    timer=setInterval(function () {
        clearInterval(timer);
        setFlag(!flag);
    }, 3000);
        if(flag){
            setOption(
                treemapOption({
                    data: data
                })
            );
                
        }else{
            setOption(
                sunburstOption({
                    data: data
                })
            );
        }
	}, [flag]);
	return (
    <Styled.Card>
    <CardContent>
      <Stack direction='row' justifyContent='space-between'>
        <Styled.Title>{t('statistic')}</Styled.Title>
      </Stack>
      <Chart height='300px'width='400px' option={option} />
    </CardContent>
  </Styled.Card>
	);
};

const treemapOption = ({data}: treemapOption): Option => {
      return {
        tooltip: {
          formatter: function (info) {
            var value:any = info;
            console.log(value);
            return [
              'Name: '+ value.data.name+'<br>',
              'Department: ' +value.data.department+'<br>',
              'Position: ' +value.data.position
            ].join('');
          }
        },
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
        tooltip: {
          formatter: function (info) {
            var value:any = info;
            console.log(value);
            return [
              'Name: '+ value.data.name+'<br>',
              'Department: ' +value.data.department+'<br>',
              'Position: ' +value.data.position
            ].join('');
          }
        },
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
