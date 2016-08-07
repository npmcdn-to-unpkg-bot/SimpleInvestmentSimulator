var InvestmentRow = React.createClass({
	render: function() {
		var name = this.props.investment.name;
		var price = this.props.investment.askPrice;
		var quantity = this.props.investment.quantity;
		return (
			<tr className="currentPortfolioData">
				<td>{name}</td>
				<td>{quantity}</td>
				<td>{price}</td>
				<input className="currentPortfolioData" type="button" value="View Stock"></input>
			</tr>
		);
	}
});

var InvestmentTable = React.createClass({
	render: function() {
		var rows = [];
		this.props.investments.forEach(function(investment) {
			rows.push(<InvestmentRow investment={investment} key = {investment.name} />);
		});
		return (
			<table>
				<thead>
					<th className="currentPortfolioHeader">Company</th>
					<th className="currentPortfolioHeader">Quantity</th>
					<th className="currentPortfolioHeader">Price Paid</th>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});

var CurrentPortfolioRow = React.createClass({
	render: function() {
		var cash = 100000;
		return (
			<div>
				<h3 style={{float: "left"}}>Current Portfolio</h3>
				<h3 style={{float: "right"}}>Cash: {cash}</h3>
			</div>
		);
	}
});

var InvestmentPortfolioTable = React.createClass({
	render: function() {
		return (
			<table className="portfolio">
				<thead>
					<CurrentPortfolioRow />
				</thead>
				<InvestmentTable investments={this.props.investments} />
			</table>
		);
	}
});

var TransactionBar = React.createClass({
	render: function() {
		return(
			<div className="currentStockInput">
				<input value="" placeholder="Quantity"></input>
				<input type="button" value="Buy"></input>
				<input type="button" value="Sell"></input>
			</div>
		);
	}
});

var CurrentPricesTable = React.createClass({
	render: function() {
		var bid = this.props.investments[1].bidPrice;
		var ask = this.props.investments[1].askPrice;
		return (
			<tbody>
				<tr>
					<th className="currentStockHeader">Bid</th>
					<th className="currentStockHeader">Ask</th>
				</tr>
				<tr>
					<td className="currentStockData">{bid}</td>
					<td>{ask}</td>
				</tr>
			</tbody>
		);
	}
});

var StockNameRow = React.createClass({
	render: function() {
		var name = this.props.investments[1].name;
		var symbol = this.props.investments[1].symbol;
		return (
			<div>
				<h3>{name}</h3>
				<h3> ({symbol})</h3>
			</div>
		);
	}
});

var CurrentStockTable = React.createClass({
	render: function() {
		return (
			<table className= "currentStock">
				<th>
					<StockNameRow investments={this.props.investments} />
				</th>
				<tbody>
					<CurrentPricesTable investments={this.props.investments} />
					<TransactionBar />
				</tbody>
			</table>
		);
	}
});

var SearchBar = React.createClass({
	render: function() {
		return (
			<div>
				<h1 style={{float: "left"}}>Simple Investment Simulator</h1>
				<input value="Lookup" type="button" className="symbolInput"></input>
				<input value="" placeholder="Enter Symbol" className="symbolInput"></input>
			</div>
		);
	}
});

var SearchableInvestmentTable = React.createClass({
	render: function() {
		return (
			<div>
				<SearchBar />
				<CurrentStockTable investments={INVESTMENTS} />
				<InvestmentPortfolioTable investments={INVESTMENTS} />
			</div>
		);
	}
});

var INVESTMENTS = [
	{
	    name : "Ford Motor",
	    symbol: "F",
	    bidPrice : 12.19,
	    askPrice : 12.23,
	    quantity : 400
	},
	{
		name : "General Electric",
		symbol: "GE",
		bidPrice : 31.23,
		askPrice: 31.27,
		quantity: 50
	},
	{
		name: "Johnson and Johnson",
		symbol: "JNJ",
		bidPrice: 124.02,
		askPrice: 124.49,
		quantity: 100
	}
];

ReactDOM.render(
	<SearchableInvestmentTable investments={INVESTMENTS} />,
	document.getElementById('container')
);