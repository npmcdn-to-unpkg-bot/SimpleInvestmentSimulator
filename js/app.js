var rows, cash;

var CurrentPortfolioRow = React.createClass({
	render: function() {
		cash = 100000;
		return (
			<tr>
				<th>Current portfolio</th>
				<th>Available Cash: {cash}</th>
			</tr>
		);
	}
});

var InvestmentRow = React.createClass({
	render: function() {
		return (
			<tr className="currentPortfolioData">
				<td>{this.props.stockName}</td>
				<td>{this.props.shares}</td>
				<td>{this.props.askPrice}</td>
				<input className="currentPortfolioData" type="button" value="View Stock"></input>
			</tr>
		);
	}
});

var InvestmentTable = React.createClass({
	render: function() {
		rows = [];
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


var InvestmentPortfolioTable = React.createClass({
	render: function() {
		return (
			<table className="portfolio">
				<thead>
					<CurrentPortfolioRow />
				</thead>
				<InvestmentTable />
			</table>
		);
	}
});


var CurrentStockTable = React.createClass({
	render: function() {
		return (
			<div>
				<table className= "currentStock">
					<thead>
						<th>{this.props.stockName}</th>
						<th> {this.props.symbol}</th>
					</thead>
					<tbody>
						<tr>
							<th>Bid</th>
							<th>Ask</th>
						</tr>
						<tr>
							<td>
								{this.props.bid}
							</td>
							<td>
								{this.props.ask}
							</td>
						</tr>
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

var TransactionBar = React.createClass({
	getInitialState: function() {
		return {shares: ''};
	},
	handleQuantityChange: function(e) {
		this.setState({
			shares: e.target.value
		});
	},
	handlePurchase: function(e) {
		e.preventDefault();
		var quantity = this.props.shares;
		if(!quantity) {
			return;
		}
		this.props.onBuySubmit({
			shares: quantity
		});
		this.setState({
			shares: ''
		});
	},	
	render: function() {
		return (
			<form className="currentStockInput" onSubmit={this.handlePurchase}>
				<input 
					type="text" 
					value={this.props.shares}
					onChange={this.handleQuantityChange}
					placeholder="How many shares?"
				/>
				<input 
					type="submit" 
					value="Buy" 
				/>
				<input type="submit" value="Sell" />
			</form>
		);
	}
});

var SearchableInvestmentTable = React.createClass({
	getInitialState: function() {
		return {
			stockName: '',
			symbol: '',
			askPrice: '',
			bidPrice: '',
			shares: ''
		};
	},
	handleSymbolSubmit: function(stockSymbol) {
		var stock_symbol = stockSymbol.symbols;
		console.log(stock_symbol);
		$.ajax({
			url: this.props.apiURL,
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
					askPrice: stockData.askPrice,
					bidPrice: stockData.bidPrice
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				alert('No stock found!')
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div>
				<SearchBar onSymbolSubmit={this.handleSymbolSubmit} />
				<CurrentStockTable 
					stockName={this.state.stockName}
					symbol={this.state.symbol}
					bid={this.state.bidPrice}
					ask={this.state.askPrice}  
				/>
				<TransactionBar />
				<InvestmentPortfolioTable investments={INVESTMENTS} url="investments.json" />
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
	<SearchableInvestmentTable apiURL="http://data.benzinga.com/rest/richquoteDelayed" pollInterval={200000} />,
	document.getElementById('container')
);