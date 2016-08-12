var investmentRows, investBtns;

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
			<div className="table-responsive_2">
				<table className="table table-striped">
					<thead>
						<CurrentPortfolioRow cash={this.props.cash} />
					</thead>
					<thead>
						<tr>
							<th>Company</th>
							<th>Quantity</th>
							<th>Price Paid</th>
							<th>Profit/Loss</th>					
						</tr>
					</thead>
					<tbody id="rows">
						{investmentRows}
					</tbody>
				</table>
			</div>
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
			<div className="table-responsive">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>{this.props.stockName}</th>
							<th> {this.props.symbol}</th>
						</tr>
					</thead>
					<thead>
						<tr>
							<th>Bid</th>
							<th>Ask</th>
						</tr>
					</thead>
					<tbody>
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
			<nav className="navbar navbar-inverse navbar-fixed-top">
	        	<div className="container-fluid">
		          	<div className="navbar-header">
		            	<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
		              		<span className="sr-only">Toggle navigation</span>
		              		<span className="icon-bar"></span>
		              		<span className="icon-bar"></span>
		              		<span className="icon-bar"></span>
		            	</button>
		            	<a className="navbar-brand" href="#">The Simple Investment Simulator</a>
		          	</div>
					<div id="navbar" className="navbar-collapse collapse">
						<form className="navbar-form navbar-right" onSubmit={this.handleSubmit}>
							<input 
								type="text" 
								value={this.state.symbols}
								onChange={this.handleSymbolChange} 
								placeholder="Enter Stock Symbol..." 
								className="form-control"
								id="invest" 
							/>
							<input
								id="currentStock" 
								value="Lookup" 
								type="submit" 
								className="form-control"
							/>
						</form>
					</div>
				</div>
			</nav>
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
				<input 
					type="button" 
					value="Sell"
					onClick={this.handleSale} />
			</form>
		);
	}
});

var Menu = React.createClass({
	getInitialState: function() {
		return (
			{
				visible: false
			}
		);
	},
	show: function() {
		investBtns = document.getElementById('invest');
		this.setState({visible: true});
		investBtns.addEventListener("click", this.hide.bind(this));
	},
	hide: function() {
		this.setState({visible: false});
	},
	render: function() {
		return (
			<div className="menu">
				<div className={(this.state.visible ? "visible" : "") + this.props.alignment}>{this.props.children}</div>
			</div>
		);
	}
});

var MenuItem = React.createClass({
	navigate: function(hash) {
		window.location.hash = hash;
	},
	render: function() {
		return (
			<div className="menu-item" onClick={this.navigate.bind(this, this.props.hash)}>
				{this.props.children}
			</div>
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
		// This will display the sliding menu on submit
		this.refs.left.show();
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
			if (investments[i].company === currentStock &&
				quantity <= investments[i].quantity) {
				var investment = document.getElementById(symbol);
				$(investment).find('#shares').text(investments[i].quantity -= quantity);
				this.setState({
					cash: availableCash
				});
				if (investments[i].quantity <= 0) {
					investment.remove();
					investments[i] = {};
				}
			} else if (investments[i].company === currentStock && investments[i].quantity < quantity) {
				alert("You cannot sell what you don't have!");  
		  	}
		}
	},
	render: function() {
		return (
			<div>
				<SearchBar onSymbolSubmit={this.handleSymbolSubmit} />
				<div>
					<Menu ref="left" alignment="left">
						<ul className="nav nav-sidebar">
							<li className="active"><a href="#">Ready to invest?<span className="sr-only">(current)</span></a></li>
						</ul>
						<MenuItem hash="first-page">
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
						</MenuItem>
					</Menu>
				</div>
				<div className="container-fluid">
			        <div className="row">
											
				        <div className="col-sm-8 col-sm-offset-3 col-md-8 col-md-offset-2 main">
				            <h1 className="page-header">Your Portfolio</h1>

				            <div className="row placeholders">
				              	<div className="col-xs-10 col-sm-12 placeholder">
				                	<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail" />
				        		</div>
			          		</div>
							<div className="portfolio" >
						        <h2 className="sub-header">Investments</h2>
								<InvestmentTable 
									investments={this.state.investments}
									cash={this.state.cash}
								/>
							</div>
						</div>
					</div>
				</div>		
			</div>
		);
	}
});

// var INVESTMENTS = [];

ReactDOM.render(
	<SearchableInvestmentTable apiURL="http://data.benzinga.com/rest/richquoteDelayed" pollInterval={200000} />,
	document.getElementById('container')
);


// Alerts

// Alert if cash will go negative if purchase is made


// Bugs

// If multiple investments are made in the same company the app does not recognize that they should be grouped together
// Write a condition that checks whether the company already exists in the investment table.
// If so then it should NOT add a new row but instead add the quantity to the existing stock Object
// It should also add the price paid to the purchase price of the existing object and divide it by two






