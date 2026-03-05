# 🐉 Dragon Ball Z Explorer

A full-stack, "Super Saiyan" level web application built with **Node.js**, **Express**, and **EJS**. This project allows users to explore the vast universe of Dragon Ball Z, from iconic characters to distant planets, pulling real-time data from the [Dragon Ball API](https://web.dragonball-api.com/documentation).

![Homepage](./images/DBZ-web-screenshot.png)

## 🌟 Key Features

* **Character Database**: Browse through a complete list of fighters with full stats and descriptions.
* **Planet Explorer**: Discover the worlds of the DBZ universe, from Namek to Planet Vegeta.
* **Deep-Dive Details**: View transformations, Ki levels, and origin stories for every character.
* **Dynamic Search**: Find your favorite warriors instantly using the search bar.
* **Immersive Experience**: Includes background music and smooth scroll-triggered animations using the Intersection Observer API.

## 🛡️ Security & Performance

This project isn't just about looks; it's built with professional-grade security:

* **Ultra Instinct Headers (Helmet.js)**: Implements secure HTTP headers to prevent Clickjacking, MIME sniffing, and cross-site scripting (XSS).
* **The "Ki Shield" (Rate Limiting)**: Protects the server from spam and bots. If a user exceeds the limit, they encounter a custom-styled "Limit Break" error page.
* **Sanitized Data**: Uses `encodeURIComponent` for safe URL handling and EJS's built-in escaping to prevent XSS attacks.
* **Defensive Coding**: Includes array-validation checks to prevent server crashes when the API returns unexpected data.



## 🛠️ Tech Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=for-the-badge&logo=helmet&logoColor=white)

* **Backend**: Node.js, Express.js
* **Frontend**: EJS (Embedded JavaScript), CSS3, Vanilla JavaScript
* **API Interactions**: Axios
* **Security**: Helmet, Express-Rate-Limit

## 🚀 Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone (https://github.com/RSP-007/DBZ-Web.git)
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run the Server**:
    ```bash
    node app.js
    ```
    *Or, if you have Nodemon installed:* `npm run dev`
4.  **Explore**:
    Go to ```bash
    `http://localhost:3000`
    ``` in your browser.

## 📁 Project Structure

```text
dbz-app/
├── public/              # Static files (CSS, Images, JS)
│   ├── styles/          # main.css and error.css
│   └── audio/           # Background music files
├── views/               # EJS Templates
│   ├── characters.ejs   # Character listing page
│   ├── character-detail.ejs # Single character view
│   └── 404.ejs          # Custom error page
├── app.js               # Main server logic and security config
└── package.json         # Dependencies and scripts
```

##📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

##🤝 Credits
Data provided by Dragon Ball API.

Created by [RSP-007] as part of a Web Development Portfolio project.
