var investmentRows;

var CurrentPortfolioRow = React.createClass({
	render: function() {
		var cash = this.props.cash;
		return (
			<tr>
				<th>Current portfolio</th>
				<th>Available Cash: ${cash}</th>
			</tr>
		);
	}
});

var InvestmentRow = React.createClass({
	render: function() {
		return (
			<tr className="currentPortfolioData" id={this.props.id}>
				<td id="name">{this.props.stockName}</td>
				<td id="shares">{this.props.shares}</td>
				<td id="paid">{this.props.askPrice}</td>
				<input className="currentPortfolioData" type="button" value="View Stock"></input>
			</tr>
		);
	}
});

var InvestmentTable = React.createClass({
	render: function() {
		investmentRows = [];
		this.props.investments.forEach(function(investment) {
			investmentRows.push(<InvestmentRow id={investment.symbol} stockName={investment.company} askPrice={investment.purchasePrice} shares={investment.quantity} />)
		});
		return (
			<table className="portfolio">
				<thead>
					<CurrentPortfolioRow cash={this.props.cash} />
				</thead>
				<thead>
					<th className="currentPortfolioHeader">Company</th>
					<th className="currentPortfolioHeader">Quantity</th>
					<th className="currentPortfolioHeader">Price Paid</th>
				</thead>
				<tbody id="rows">
					{investmentRows}
				</tbody>
			</table>
		);
	}
});

var InvestmentPortfolioTable = React.createClass({
	render: function() {
		return (
			<table className="portfolio">
				<InvestmentTable rows={this.props.rows} />
			</table>
		);
	}
});


var CurrentStockTable = React.createClass({
	render: function() {
		return (
			<div>
				<table className="currentStock">
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
		return {
			shares: ''
		};
	},
	handleQuantityChange: function(e) {
		this.setState({
			shares: e.target.value
		});
	},
	handlePurchase: function(e) {
		e.preventDefault();
		var quantity = this.state.shares.trim();
		if(!quantity || isNaN(quantity) === true) {
			alert('Enter a number greater than zero!');
			return;
		}
		this.props.onBuySubmit({shares: quantity});
		this.setState({shares: ''});		
	},
	handleSale: function(e) {
		e.preventDefault();
		var quantity = this.state.shares.trim();
		this.props.onSellSubmit({shares: quantity});
		this.setState({shares: ''});
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
				<input type="button" value="Sell" onClick={this.handleSale} />
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
			cash: 100000,
			investments: []
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
		var quantity = parseInt(quantity.shares);
		var price= this.state.askPrice;
		var totalPrice= price * quantity;
		var currentCash= this.state.cash;
		var availableCash= currentCash - totalPrice;
		this.setState({
			company: this.state.stockName,
			purchasePrice: this.state.askPrice,
			shares: quantity,
			cash: availableCash
		});
		if (this.state.stockName === '') {
			alert('Enter a symbol first!')
			return;
		}
		this.state.investments.push({
			company: this.state.stockName,
			purchasePrice: this.state.askPrice,
			quantity: quantity,
			symbol: this.state.symbol
		});
	},
	handleInvestmentSale: function(quantity) {
		var quantity = parseInt(quantity.shares);
		var value= this.state.bidPrice;
		var totalValue= value * quantity;
		var currentCash= this.state.cash;
		var availableCash= currentCash + totalValue;
		var currentStock = this.state.stockName;
		var symbol = this.state.symbol;
		var investments = this.state.investments;
		for (var i = 0; i < investments.length; i++) {
			if (investments[i].company === currentStock) {
				var investment = document.getElementById(symbol);
				$(investment).find('#shares').text(investments[i].quantity -= quantity);
				this.setState({
					cash: availableCash
				});
				if (investments[i].quantity <= 0) {
					investment.remove();
				}
			}  
		}
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
				<TransactionBar 
					company={this.state.stockName}
					onBuySubmit={this.handleInvestment}
					investments={this.state.investments}
					onSellSubmit={this.handleInvestmentSale} 
				/>
				<InvestmentTable 
					investments={this.state.investments}
					cash={this.state.cash}
				/>
			</div>
		);
	}
});

// var INVESTMENTS = [];

ReactDOM.render(
	<SearchableInvestmentTable apiURL="http://data.benzinga.com/rest/richquoteDelayed" pollInterval={200000} />,
	document.getElementById('container')
);



