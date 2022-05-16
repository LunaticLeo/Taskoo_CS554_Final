<h1 align="center">Taskoo | CS-554 Final</h1>

<p align="center">
<img src="https://img.shields.io/badge/-React-eee?style=flat-square&logo=react" />
<img src="https://img.shields.io/badge/-TypeScript-eee?style=flat-square&logo=typescript" />
<img src="https://img.shields.io/badge/-NodeJS-eee?style=flat-square&logo=node.js" />
<img src="https://img.shields.io/badge/-MongoDB-eee?style=flat-square&logo=mongodb" />
</p>

<p>
A Task Management System with a strict authority management mechanism, Integrate level management like Canvas, and project progress tracking functions of Trello.
</p>
<p>
This web application is used by organizations (company/university) to manage projects in each department. It provides a more efficient way to authorize access, track the progress of projects, assign resources, etc.
</p>

## Group Member
Yufu Liao  
Shihao Xiong  
Peixi Dai  
Wenjing Zhou  
Shiling Ding  

## Tech Stack 💻
* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Material UI](https://mui.com/)
* [i18next](https://react.i18next.com/)
* [ECharts](https://echarts.apache.org/en/index.html)
* [Socket.io](https://socket.io/)
* [Google Cloud Storage](https://cloud.google.com/)

## Documentation 📖
* [Technical Implementation Plan](https://stevens0-my.sharepoint.com/:w:/g/personal/sxiong5_stevens_edu/EWJkiuUG4PhEliMxonPS0RQBJVH_C_mfK4eOoFqYGfcwnQ?e=4dv2rL)
* [Project Features ](https://stevens0-my.sharepoint.com/:w:/g/personal/yliao10_stevens_edu/EWtM_BAAjthHj5dDtcM9W-8BXkLfIYMzv8x_0xUkKB1zXQ?e=fAyAbY)
* [Database Design ](https://stevens0-my.sharepoint.com/:w:/g/personal/sxiong5_stevens_edu/EfxWAIsqfp5FmLfp-46rxpIBk4Ep4YOiGzqBIBuWKB3gyQ?e=a7fxRu)
* [Postman API Doc](https://documenter.getpostman.com/view/13354448/UVyn1yY2)
* [Tasks Assign](https://docs.google.com/document/d/1zbjgbLGnco0On2ik0vOc84S6zpXB2IiVcLU0Z4C0ibM/edit?usp=sharing)

## Get Start
Make sure your device have install Nodejs, MongoDB, Redis.

- Install
```
git clone https://github.com/liaoyufu-leo/StevensMarketPlace_CS_546_Group16_FinalProject.git
```
- Initialization
```
cd /Taskoo_CS554_Final/back-end
npm install
#this usually take more than 1 minutes, please wait for it end
npm run seed
cd ../front-end
npm install 
```

## Launch Application
```
# please make sure you are in the project root path first
# please make sure the 3000 & 4000 ports are not used first
# open two terminals to run these commands seperately, CTRL + C will close the project.

# terminal 1
cd ./back-end
npm start 


cd ./front-end
npm start
```

Once commands run successfully, you can see the website in [localhost:3000](http://localhost:3000/)
!

## Default accounts
| Account| Password|
| - | -|
|yufu@taskoo.com|yl123456|
|sxiong5@taskoo.com|sx123456|
|shilin@taskoo.com|sd123456|
|peixin@taskoo.com|pd123456|
|wenjing@taskoo.com|wz123456|
