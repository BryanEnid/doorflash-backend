### DoorFlash: [Demo](https://bryanenid.github.io/doorflash/)

![](https://i.ibb.co/k5mnMwy/Capture.png)
A copy of DoorDash.com, A webscrapper that uses Puppeter which scraps all the data from a specific username only for itself and then saves all the data to MongoDB.
Creates a REST Api, using Express, and the view part of the MVC uses React.js.
[Link for the preview](https://bryanenid.github.io/doorflash/)

**Back End:** [GitHub Repository](https://github.com/BryanEnid/doorflash-api)
- Node.js
- NGINX
- Express.js
- DOCKER
- Linux

**Front End** [GitHub Repository](https://github.com/BryanEnid/doorflash)
- React.js

### End Points
Domain name: https://api.bryanenid.com

A list of stores: Example: [https://api.bryanenid.com/v1/partnerships](https://api.bryanenid.com/v1/partnerships)
```
/v1/partnerships
```


Information about the selected store: Example: [https://api.bryanenid.com/v1/partnerships/farm_burger](https://api.bryanenid.com/v1/partnerships/farm_burger)
```
/v1/partnerships/{NAME_OF_THE_PARTNERSHIP}
```


Menu of the selected store: Example: [https://api.bryanenid.com/v1/partnerships/farm_burger/menu](https://api.bryanenid.com/v1/partnerships/farm_burger/menu)
```
/v1/partnerships/{NAME_OF_THE_PARTNERSHIP}/menu
```





