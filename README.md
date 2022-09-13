# H1 STOCKTRACKER

### H3 Project Description:

Tired of having to track your stocks across multiple accounts?  Not satisfied with your ugly tracking app?  Look no further than Stocktracker!  Stocktracker will allow you to add your stocks and allow you to track them as you become the next Warren Buffett or plunge into despair.  

***

### H3 API:

https://finnhub.io/

proof of concept:

![api](images/APIProof.png)

*** 

### H3 Restful Routing:

| Method | Action | Description |
|:------:|:------:|:-----------:|
| POST   | /users | Creates new user |
| GET    | /users/new | Shows form for creating new sser |
| PUT    | /users/:id | Edit User |
| DELETE | /users/:id | Delete User |

| Method | Action | Description |
|:------:|:------:|:-----------:|
| GET    | /users/:id/stocks | Show user's stocks |
| POST   | /users/:id/stocks| Add's new stocks to user |
| GET    | /users/:id/stocks/new | Shows form for adding new stocks |
| PUT    | /users/:id/stocks | Updates user's stocks |
| DELETE | /users/:id/stocks/:id | Deletes stock from users list of stocks|

### H3 Wireframe:

Homepage:

![wireframe1](https://wireframe.cc/rHblsd)

User Stocks Page:

![wireframe2](https://wireframe.cc/n801Gw)

Sign Up Page:

![wireframe3](https://wireframe.cc/J4HEwn)

Add Stock Page:

![wirefram4](https://wireframe.cc/yfCVJf)

### H3 MVP/Stretch Goals

#### H4 MVP

- user is able to view, add, delete, and update stocks on profile
- user can login and have their stock information saved
- user can easily access any stock information
- user can add what price they bought the stock at and show their net gain/loss

#### H4 Stretch Goals

- add more information for each stock
- make the page look nice
- add graph/trends

