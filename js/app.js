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
		return (
			<table>
				<thead>
					<th className="currentPortfolioHeader">Company</th>
					<th className="currentPortfolioHeader">Quantity</th>
					<th className="currentPortfolioHeader">Price Paid</th>
				</thead>
				<tbody>
					<InvestmentRow stockName={this.props.stockName} askPrice={this.props.askPrice} shares={this.props.shares} />
				</tbody>
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
				<InvestmentTable rows={this.props.rows} />
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
			symbols: e.target.value.toUpperCase()
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
		var quantity = this.state.shares.trim();
		if(!quantity) {
			return;
		}
		this.props.onBuySubmit({shares: quantity});
		this.setState({shares: ''});		
	// 	// this.props.onBuySubmit(function(e) {
	// 	// 	rows.push(<InvestmentRow stockName={this.state.stockName} shares={this.state.shares} askPrice={this.state.askPrice} />);
	// 	// });	
	},	
	render: function() {
		return (
			<form className="currentStockInput" onSubmit={this.handlePurchase}>
				<input 
					type="text" 
					value={this.state.shares}
					onChange={this.handleQuantityChange}
					placeholder="How many shares?"
				/>
				<input 
					type="submit" 
					value="Buy" 
				/>
				<input type="button" value="Sell" />
			</form>
		);
	}
});

var SearchableInvestmentTable = React.createClass({
	getInitialState: function() {
		return {
			stockName: '',
			company: '',
			symbol: '',
			askPrice: '',
			purchasePrice: '',
			bidPrice: '',
			shares: '',
			rows: []
		};
	},
	handleSymbolSubmit: function(stockSymbol) {
		var self = this;
		var stock_symbol = stockSymbol.symbols;
		$.ajax({
			url: this.props.apiURL,
			dataType: 'jsonp',
			type: 'GET',
			data: stockSymbol,
			success: function(result) {
				Object.keys(result).forEach(function(prop) {
					var stockData = result[prop];
					console.log(stockData.error);
					if(stockData.error) {
						alert('No stock found!')
					}
					self.setState({
						stockName: stockData.name,
						symbol: stockData.symbol,
						askPrice: stockData.askPrice,
						bidPrice: stockData.bidPrice
					});
				})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				alert('No stock found!')
			}.bind(this)
		});
	},
	handleInvestment: function(quantity) {
		var quantity = quantity.shares;
		this.setState({
			company: this.state.stockName,
			purchasePrice: this.state.askPrice,
			shares: quantity
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
				<TransactionBar onBuySubmit={this.handleInvestment} />
				<InvestmentTable 
					stockName={this.state.company}
					askPrice={this.state.purchasePrice}
					shares={this.state.shares}
				/>
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