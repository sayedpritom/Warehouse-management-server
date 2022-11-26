## This is a warehouse management website to manage inventory of a shoe company. Live website link: https://warehouse-eebb3.web.app


## Currently you're looking at the server. The implemented APIs here are: 
1. get 6 inventory items for the "Home" page
2. get all items for the "Manage inventories" page
3. get all items for the "Manage inventories" page added by a particular user
4. get, update, create, and delete a particular item
5. used JWT middleware for user verification

Used Technologies: Node, Express, MongoDB, Heroku

## Front-end Code: https://github.com/sayedpritom/warehouse-management-client

## Implemented front-end features and functionalities: 

* Home page with a header (simple navbar), banner, items (inventory items. Maximum 6 items), advantages section, pricing section, feature section,  footer section.

* Extra sections(advantages section, pricing section, feature section,) on the home page.

* Six items in the inventory items section. Each article has a relevant name, image, short description, price, quantity, supplier name, and an update button.

* Clicking on the button takes the user to the inventory/:id route. This route is a private/protected route. The private route redirects to the login page if the user is not logged in. After login, the user is redirected to the page he/she wanted to go to. 

* The inventory/:id page displays detailed item information like id, name, image, description, price, quantity, supplier name, sold, etc. This page has a Button named delivered. Once this button is clicked, it reduces the quantity of the item by one and changes the quantity on the website.

* a small form on the inventory/:id page. To restock the items. An input field where some numbers can be put. And hitting the button will increase the quantity of the item.

* Manage Inventories button at the bottom of the inventory section of the home page. The same bottom on the inventory:/id page. This link button takes you to the manage inventory page. This page shows all the inventory items. Every item has a delete button. This deletes the item. 

* ON the Manage Inventories page, there is a button named add "new item". It takes to the "add inventory item" page and there is a form for adding new items.

* Implemented email/password-based authentication and social login(Google, Github) authentication. Once a user is logged in, the logout/sign-out button appears on the header, signing out the user once clicked.

* If a user is logged in, they will see more options like Manage Items, Add Item, My items, and Logout.

* On the My Items page, the logged-in user sees only his/her Items. If the user wants, he/she is able to cancel/delete any item.  User is also can delete an item either from the Manage Inventories page or from the My Items page.

* Added two more routes. One route is blogs. Another is 404 not found. 

* Displays error when user email address or password don't match.

* Sends Email Verification while singing in new user.

* Full responsive website

* Added a loading spinner if data is loading.

* Used the Environment variable on both the client and server-side and the .gitignore file on the server-side.

* Implemented the basic version of the jwt token for email/password-based authentication. 

Used Technologies: HTML, CSS, Bootstrap, Javascript, React, React Router, React hook form, React Toastify, React firebase hooks, firebase, Axios, Json Web Token, Font Awesome, 
