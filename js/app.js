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
			<tr className="currentStockInput">
				<td>
					<input type="text" value="" placeholder="Quantity"></input>
				</td>
				<td>
					<input type="button" value="Buy"></input>
				</td>
				<td>
					<input type="button" value="Sell"></input>
				</td>
			</tr>
		);
	}
});

var CurrentStockTable = React.createClass({
	getInitialState: function() {
		return {
			stockName: '',
			symbol: '',
			ask: 0,
			bid: 0
		};
	},
	handleSymbolSubmit: function(stockSymbol) {
		var stock_symbol = stockSymbol.symbols;
		console.log(stock_symbol);
		$.ajax({
			url: this.props.url,
			dataType: 'jsonp',
			type: 'GET',
			data: stockSymbol,
			success: function(result) {
				console.log(result.stock_symbol);
				console.log(result.JNJ === result.stock_symbol);
				var stockData = result.JNJ;
				this.setState({
					stockName: stockData.name,
					symbol: stock_symbol,
					ask: stockData.askPrice,
					bid: stockData.bidPrice
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				alert('No stock found!')
			}.bind(this)
		});
	},
	loadCurrentState: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'jsonp',
			cache: false,
			data: this.state.symbol,
			success: function(result) {
				var stockData = result[0];
				this.setState({
					ask: stockData.askPrice,
					bid: stockData.bidPrice
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});				
	},
	componentDidMount: function() {
		this.loadCurrentState();
		setInterval(this.loadCurrentState, this.props.pollInterval);
	}, 
	render: function() {
		return (
			<div>
				<SearchBar onSymbolSubmit={this.handleSymbolSubmit} />
				<table className= "currentStock">
					<thead>
						<th>{this.state.stockName}</th>
						<th> {this.state.symbol}</th>
					</thead>
					<tbody>
						<tr>
							<th>Bid</th>
							<th>Ask</th>
						</tr>
						<tr>
							<td>
								{this.state.bid}
							</td>
							<td>
								{this.state.ask}
							</td>
						</tr>
						<TransactionBar />
					</tbody>
				</table>
			</div>
		);
	}
});

var SearchBar = React.createClass({
	getInitialState: function() {
		return {symbols: ''};
	},
	handleSymbolChange: function(e) {
		this.setState({
			symbols: e.target.value
		});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var symbol = this.state.symbols.trim();
		if (!symbol) {
			return;
		}
		this.props.onSymbolSubmit({symbols: symbol});
		this.setState({symbols: ''});
	},
	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input 
					value="Search" 
					type="submit" 
					className="symbolInput"
				/>
				<input 
					type="text" 
					value={this.state.symbols}
					onChange={this.handleSymbolChange} 
					placeholder="Enter Stock Symbol" 
					className="symbolInput" 
				/>
			</form>
		);
	}
});

var SearchableInvestmentTable = React.createClass({
	render: function() {
		return (
			<div>
				<CurrentStockTable url="http://data.benzinga.com/rest/richquoteDelayed" pollInterval={200000} />
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