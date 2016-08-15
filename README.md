Simple Investment Simulator
===============================

## Introduction

This application was built using the ReactJS library and makes use of a delayed stock quote API developed by Benzinga to deliver market data to the user. The user can input any valid stock symbol and they will receive the top bid and ask price for that investment. For those who are not familar with investing, the bid price is the price you receive if you are selling stock, the ask price is the price you receive when you are purchasing a stock. The user will start out with $100,000 to invest in any number of stocks. This application promotes diversification, the user will only be allowed to purchase an investment once but they can purchase as many shares as the cash value will allow. The stocks that are purchased will show up in a table that illustrates the user's portfolio. The application allows the user to sell the investments they purchase as well, short selling is not allowed. If all shares of an investment are sold then the investment will be removed from the portfolio table. The application makes use of a standard AJAX request to get market data from the API and every 10 seconds seamlessly updates the bid and ask prices of the current stock. 

## Files

This application makes use of one HTML file, one main CSS stylesheet, one CSS stylesheet for the sliding menu, the bootstrap dashboard files, three image files, one JavaScript file that holds all of the ReactJS JSX code, and the latest version of the jquery library. Grunt was used to minify the application files. 

## Getting Started

1. To get started, clone the repository or download the zip file. 

2. Once you have access to the project files you will need to set up a local server. (MAMP was used to test this application and is recommended)

3. After the local server has been set up, you should be able to open the application in your browser. If you are using MAMP and you receive a 'Forbidden' error then check the URL. Make sure that the URL consists of only 'localhost:' and the port number used by the local server, the port number is usually 8888. 

## References

[ReactJS documentation](https://facebook.github.io/react/)

[Stackoverflow](http://stackoverflow.com/)

[How to build a sliding menu using ReactJS](https://www.codementor.io/reactjs/tutorial/how-to-build-a-sliding-menu-using-react-js-and-less-css)

[Grunt documentation](http://gruntjs.com/getting-started)

[https://www.npmjs.com/](https://www.npmjs.com/)

[jQuery documentation](http://api.jquery.com/)

[MAMP documentation](https://www.mamp.info/en/)

[Bootstrap documentation](http://getbootstrap.com/)

