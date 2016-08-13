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
								${this.props.bid}
							</td>
							<td>
								${this.props.ask}
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
	render: function() {
		return (
			<div className="menu-item">
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
			investments: [],
		};
	},
	handleSymbolSubmit: function(stockSymbol) {
		var self = this;
		var stock_symbol = stockSymbol.symbols;
		console.log(stockSymbol)
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
					console.log(stockData.askPrice);
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
	loadPriceUpdates: function() {
		var self = this;
		$.ajax({
			url: this.props.apiURL,
			dataType: 'jsonp',
			type: 'GET',
			data: {symbols: this.state.symbol},
			success: function(result) {
				Object.keys(result).forEach(function(prop) {
					var stockData = result[prop];
					self.setState({
						askPrice: stockData.askPrice,
						bidPrice: stockData.bidPrice,
					});
				});
				console.log('loadPriceUpdates works');
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				console.log('loadPriceUpdates fail')
			}.bind(this)
		});
	},
	handleInvestment: function(quantity) {
		var quantity = parseInt(quantity.shares);
		var price= this.state.askPrice;
		var totalPrice= price * quantity;
		var currentCash= this.state.cash;
		var availableCash= currentCash - totalPrice;
		var investments = this.state.investments;
		for (var i = 0; i < investments.length; i++) {
			if (investments[i].company === this.state.stockName) {
				alert('You have this stock already. You should diversify!');
				return;
			}
		}
		this.setState({
			company: this.state.stockName,
			purchasePrice: this.state.askPrice,
			shares: quantity,
			cash: availableCash
		});
		if (this.state.stockName === '') {
			alert('Enter a symbol first!')
			return;
		} else if (totalPrice > currentCash) {
			alert('You cannot afford this! Sell some stock.');
			this.setState({
				cash: currentCash
			});
			return;
		}
		this.state.investments.push({
			company: this.state.stockName,
			purchasePrice: this.state.askPrice,
			quantity: quantity,
			symbol: this.state.symbol,
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
	componentDidMount: function() {
		this.loadPriceUpdates();
		setInterval(this.loadPriceUpdates, this.props.pollInterval);
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
						<MenuItem>
							<CurrentStockTable 
								stockName={this.state.stockName}
								symbol={this.state.symbol}
								bid={numeral(this.state.bidPrice).format('0,0')}
								ask={numeral(this.state.askPrice).format('0,0')}  
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
					            <div className="placeholder">
					            	<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail" />
					            	<h4>Label</h4>
					            	<span className="text-muted">Something else</span>
					            </div>
					            <div className="placeholder">
					            	<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail" />
					            	<h4>Label</h4>
					            	<span className="text-muted">Something else</span>
					            </div>
					            <div className="placeholder">
					            	<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" className="img-responsive" alt="Generic placeholder thumbnail" />
					            	<h4>Label</h4>
					            	<span className="text-muted">Something else</span>
					            </div>
			          		</div>
							<div className="portfolio" >
						        <h2 className="sub-header">Investments</h2>
								<InvestmentTable 
									investments={this.state.investments}
									cash={numeral(this.state.cash).format('0,0.00')}
								/>
							</div>
						</div>
					</div>
				</div>		
			</div>
		);
	}
});

ReactDOM.render(
	<SearchableInvestmentTable apiURL="http://data.benzinga.com/rest/richquoteDelayed" pollInterval={10000} />,
	document.getElementById('container')
);







