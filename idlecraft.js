

function Idlecraft() {

	// Settings
	this.setting_generate_multiplier 	= [ 1.06 , 60.0 , 540 ,  4320,        51840,       622080,       8709120,      139345920,      2508226560,      50164531200  ];
	this.setting_price_base 	 	 	= [ 4.00 , 60.0 , 720 ,  8640,        83680,      1044160,      10929920,      179159040,      4149000000,      65798000000  ];
	this.setting_price_delta 			= [ 0.28 , 9.00 , 115 ,  1440,        14183,       180027,       1917529,       31992685,       754363636,      12184814814  ]; 
	this.setting_price_delta2  			= [ 0.02 , 1.35 , 18.3,   240,         2403,        31039,        336408,        5712979,       137157024,       2256447187  ];
	this.setting_price_delta3 			= [ 0.02 , 0.04 , 0.08,  0.16,         0.32,         0.64,          1.28,           2.56,            5.12,            10.24  ];
	this.setting_duration      			= [  500 , 2500 , 5000,   11000,      23000,        47000,         95000,         191000,          383000,           767000  ];
	this.setting_managerprice 			= [ 1000, 15000, 100000, 500000,    4200000,     40000000,     870000000,    14000000000,    280000000000,    7000000000000  ];
	this.timerinterval 		= 20;
	

	// Variables
	this.generate_profits 	= [];
	this.prices   		  	= [];
	this.prices_delta		= [];
	this.prices_delta2   	= [];
	this.durations 			= [];
	this.durationremaining 	= [];
	this.itemactivated 		= [];
	this.managerhired 		= [];
	this.balance 			= 0.00;
	this.durationbarlength  = 200;

	
	//---------
	this.bindclickevent = function() {

		var ic = this;
		for ( var i = 0 ; i < 10 ; i++ ) {

			$("#c2"+i).click( ( function(ii) {
				return function(){
					ic.item_generate_onclick(ii);
				}
			} )(i) );


			$("#c4"+i).click( ( function(ii) {
				return function(){
					ic.item_upgrade_onclick(ii);
				}
			} )(i));

			$("#c6"+i).click( ( function(ii) {
				return function(){
					ic.item_hiremanager_onclick(ii);
				}
			} )(i));

			$("#icactivate"+i).click( ( function(ii) {
				return function(){
					ic.item_upgrade_onclick(ii);
				}
			} )(i));

			
		}	

	}

	//------------------
	this.createdom = function() {

		var ic = this;
		strhtml = "";
		for ( var row = 0 ; row < 5 ; row += 1 ) {
				
			strhtml += "<div class='ictrow'>";
			for ( var col = 0 ; col < 2 ; col += 1  ){

				var itemid = row * 2 + col;

				strhtml += "<div class='ictcol'>";
					strhtml += "<div class='icsubtable' id='ictable" + itemid + "'  style='display:none;' >";

							
					strhtml += "<div class='ictrow'>";
						strhtml += "<div class='ictcol1'>Item " + itemid +"<div id='c1"+ itemid +"' ></div></div>";
						strhtml += "<div class='ictcol2' id='c2"+ itemid +"'>"
							strhtml += "<div id='c2lbl"+ itemid +"'></div>";
							strhtml += "<div class='durationbar' id='durationbar"+ itemid +"'></div>";
						strhtml += "</div>"
					
					strhtml += "</div>"

		
					strhtml += "<div class='ictrow'>";
						strhtml += "<div class='ictcol3' id='c3" + itemid + "' >1</div>";
						strhtml += "<div class='ictcol4' id='c4" + itemid + "' ></div>";
					strhtml += "</div>"


					strhtml += "<div class='ictrow'>";
						strhtml += "<div class='ictcol5'></div>";
						strhtml += "<div class='ictcol6' id='c6" + itemid + "' >Hire Manager</div>";
					strhtml += "</div>"
						
						

					strhtml += "</div>"
					
					strhtml += "<div class='icactivate' id='icactivate"+ itemid+"'>Activate</div>"
										

				strhtml += "</div>"


				this.prices[itemid] 		  				= this.setting_price_base[itemid];
				this.prices_delta[itemid] 					= this.setting_price_delta[itemid]; 
				this.prices_delta2[itemid] 					= this.setting_price_delta2[itemid];
				this.generate_profits[itemid] 				= this.setting_generate_multiplier[itemid];
				this.durations[itemid] 						= this.setting_duration[itemid] ;
				this.durationremaining[itemid] 				= 0;	
				this.managerhired[itemid] 					= 0;

				if ( itemid == 0 ) {
					this.itemactivated[itemid] 		= 1;
				} else {
					this.itemactivated[itemid] 		= 0;
				}

			}

			strhtml += "</div>";

		}	
		$("#ictable").append(strhtml);
	}

	//-----
	this.debug = function() {

		
	}


	//-----------
	this.formatcurrency = function( currency ) {

		if ( currency > 1000000000 ) {
			return ( currency / 1000000000 ).toFixed(3) + " Billion";
		} else if ( currency > 1000000 ) {
			return ( currency / 1000000 ).toFixed(3) + " Million";
		}

		return currency.toFixed(2);
	}

	//---------
	this.gen_profit = function() {

		for ( var i = 0 ; i < 10 ; i++ ) {

			if ( this.itemactivated[i] > 0 ) {
				if ( this.durationremaining[ i ] > 0 ) {
					this.durationremaining[ i ] -= this.timerinterval ;
					
					if ( this.durationremaining[i] <= 0 ) {
						this.durationremaining[i] = 0;
						this.balance += this.generate_profits[i];
					
						if ( this.managerhired[i] == 1 ) {
							this.durationremaining[i] = this.durations[i];
						}
					}

				}
			}
		}

	}


	//-------------------------------
	this.init = function() {

		var ic = this;
		this.createdom();
		this.bindclickevent();
		this.debug();

		setTimeout( function() {
			ic.on_timer();
		},this.timerinterval );

	}	

	//------------
	this.item_generate_onclick = function( itemid ) {

		if ( this.durationremaining[itemid] == 0 ) {
			this.durationremaining[itemid] = this.durations[itemid];
		}
	}


	//------
	this.item_hiremanager_onclick = function( itemid ) {

		if ( this.managerhired[itemid] == 0 ) {
			if ( this.balance >= this.setting_managerprice[itemid] ) {
				
				this.balance -= this.setting_managerprice[itemid];
				this.managerhired[itemid] = 1;

				if ( this.durationremaining[itemid] <= 0 ) {
					this.durationremaining[itemid] = this.durations[itemid];
				}	
			}
		}
	}

	//-------
	this.item_upgrade_onclick = function( itemid ) {

		if ( this.balance >= this.prices[itemid] ) {
			
			this.balance -= this.prices[itemid];
			this.itemactivated[itemid] += 1;
			
			this.generate_profits[itemid] = this.setting_generate_multiplier[itemid] * this.itemactivated[itemid];
			
			this.prices[itemid] 		  += this.prices_delta[itemid];
			this.prices_delta[itemid]     += this.prices_delta2[itemid];
			this.prices_delta2[itemid]    += this.setting_price_delta3[itemid];
			
			// Double speed at 25th, 50th,100th upgrade..
			if ( this.itemactivated[itemid]  % 25 == 0 ) {
				var a = this.itemactivated[itemid] / 25;
				if ( (a & (a - 1)) == 0) {
					this.durations[itemid] = (this.durations[itemid] / 2) >> 0;
					if ( this.durations[ itemid ] < 1 ) {
						this.durations[itemid] = 1;
					}

				}
			}

		}	

	}
	
	//------
	this.renderval = function() {

		for ( var i = 0 ; i < 10 ; i++ ) {

			if ( this.itemactivated[i] > 0 ) {

				$("#ictable" + i).show();

				$("#c1"+i).html( "Time :" + this.durations[i] );

				if ( this.durationremaining[i] > 0 ) {
					$("#c2lbl"+i).html( "Generate: $ " + this.formatcurrency( this.generate_profits[i] ) + "<br/>" +  ( this.durationremaining[i]/1000 ).toFixed(3) + "s remaining");
				} else {
					$("#c2lbl"+i).html( "Generate: $ " + this.formatcurrency( this.generate_profits[i] ) );
				}

				if ( this.durations[i] <= 100 ) {
					var length_in_pixel = this.durationbarlength;
				} else {
					var length_in_pixel = ( this.durationremaining[i] * this.durationbarlength / this.durations[i] ) >> 0;
				}

				$("#durationbar" + i ).css("width", length_in_pixel + "px");
				
				$("#c3"+i).html( "Qty : " + this.itemactivated[i] );
				$("#c4"+i).html( "Buy : $ " + this.formatcurrency( this.prices[i] ) );
				
				if ( this.managerhired[i] == 1 ){
					$("#c6"+i).html("Manager Hired");
				} else {
					$("#c6"+i).html("Hire Manager : $ " + this.formatcurrency( this.setting_managerprice[i] ) );
				}

				$("#icactivate" + i).hide();

			} else {
				
				$("#ictable" + i).hide();
				$("#icactivate" + i).html("Activate for $ " +  this.formatcurrency( this.prices[i] ) );
				$("#icactivate" + i).show();

			}	
		}

		$("#balance").html( "Balance : $ " + this.formatcurrency( this.balance ) );
	}

	//------
	this.on_timer = function() {

		var ic = this;

		this.gen_profit();
		this.renderval();

		
		setTimeout( function() {
			ic.on_timer();
		},this.timerinterval );
	}

	
}

//------------------
function main() {
	ic = new Idlecraft();
	ic.init();
}
