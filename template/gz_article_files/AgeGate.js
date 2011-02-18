(function($) {
	$.widget('ui.AgeGate', {

		initialize: function() {
			var birthdate = jQuery.cookie( 'visitor_birthdate' );
			if ( birthdate != null ) {
				parts = birthdate.split('_');
				daysLeft = this.getDaysLeft( this.options.limit, parts[0], parts[1], parts[2] );
				if ( daysLeft == 0 ) {
					this.options.handler();
					return true;
				} else {
					jQuery( '#obj_' + this.options.id )[0].innerHTML = jQuery('#agegate_container_rejected')[0].innerHTML.replace( /IDHERE/, this.options.id );
					roundbox = jQuery( '#agegate_' + this.options.id + ' .roundbox' )[0];
                    if ( window['mobile_view'] != undefined ) {
                        roundbox.style.marginTop = 0;
                    } else {
                        roundbox.style.marginTop = Math.floor( ( this.options.object['height'] - roundbox.scrollHeight - 10 ) / 2 ) + 'px';
                    }
				}
			}
			else
			{
				jQuery( '#obj_' + this.options.id )[0].innerHTML = jQuery('#agegate_container')[0].innerHTML.replace( /IDHERE/, this.options.id );
				this.setupForm();
			}
            if ( window['mobile_view'] != undefined ) {
                jQuery( '#agegate_' + this.options.id )[0].style.width =  305 + 'px';
                jQuery( '#agegate_' + this.options.id )[0].style.height =  193 + 'px';
            } else {
                jQuery( '#agegate_' + this.options.id )[0].style.width =  this.options.object['width'] + 'px';
                jQuery( '#agegate_' + this.options.id )[0].style.height =  this.options.object['height'] + 'px';
            }
		},

		setupForm: function() {
			jQuery( 'INPUT.agegate_control' ).focus( function() {
				if (this.value == this.defaultValue){  
		            this.value = '';  
		        }  
		        if( this.value != this.defaultValue ){  
		            this.select();  
		        }  					
				this.style.color = 'black';
			});
			jQuery( 'INPUT.agegate_control' ).blur( function() {
				if ( $.trim( this.value ) == '' ) {
		            this.value = ( this.defaultValue ? this.defaultValue : '' );  
					this.style.color = 'lightgrey'; 
		        }  
			});
			jQuery( 'INPUT.agegate_control' ).keypress( function(e) {
				if ( ( e.which > 31 && e.which < 48 ) || ( e.which > 57 && e.which < 127 ) ) { return false; }
			});
			roundbox = jQuery( '#agegate_' + this.options.id + ' .roundbox' )[0];
            if ( window['mobile_view'] != undefined ) {
                roundbox.style.marginTop = 0;
            } else {
    			roundbox.style.marginTop = Math.floor( ( this.options.object['height'] - roundbox.scrollHeight - 10 ) / 2 ) + 'px';
            }			this.setControls();
			this.registerEventHandler( this.controls.agegate_form, 'submit', this.validateAge.bind(this));
			this.agegate_validator = new Validator( jQuery.extend( {}, { 'scope': this.controls.agegate_form } ));
		},
		
		validateAge: function( ev ) {
			this.agegate_validator.hideErrors();
			if ( this.agegate_validator.validate() ) {
				year = this.controls.year[0].value;
				month = this.controls.month[0].value;
				day = this.controls.day[0].value;
				jQuery.cookie( 'visitor_birthdate', year+'_' + month + '_' + day )
				gates = GawkerClientside.widgets.agegate;
				for( i = 0; i < gates.length; i++ ) {
					daysLeft = this.getDaysLeft( gates[i].options.limit, year, month, day );
					if ( daysLeft == 0 ) {
						gates[i].options.handler();
					}
					else { 
						jQuery( '#obj_' + gates[i].options.id )[0].innerHTML = jQuery('#agegate_container_rejected')[0].innerHTML.replace( /IDHERE/, gates[i].options.id );
						jQuery( '#agegate_' + gates[i].options.id )[0].style.width =  gates[i].options.object['width'] + 'px';
						jQuery( '#agegate_' + gates[i].options.id )[0].style.height =  gates[i].options.object['height'] + 'px';
						roundbox = jQuery( '#agegate_' + gates[i].options.id + ' .roundbox' )[0];
                        if ( window['mobile_view'] != undefined ) {
                            roundbox.style.marginTop = 0
                        } else {
                            roundbox.style.marginTop = Math.floor( ( gates[i].options.object['height'] - roundbox.scrollHeight - 10 ) / 2 ) + 'px';
                        }					}
				}
			}
			else {
				this.agegate_validator.showErrors();
			}
			ev.stopPropagation();
			ev.preventDefault();
		},

		getDaysLeft: function( limit, year, month, day ) {
			now = new Date();
			birth = Date.UTC( year, month, day, 0, 0, 0, 0 );
			nowyear = now.getYear();
			nowyear += nowyear < 1900 ? 1900 : 0; 
			start = Date.UTC( ( nowyear - limit ), now.getMonth() + 1, now.getDate(), 0, 0, 0, 0 );
			if ( start > birth ) { daysLeft = 0 }
			else { daysLeft = Math.floor( ( birth - start ) / ( 86400 * 1000 ) ); }
			return daysLeft;
		}
	});

	$.extend($.ui.AgeGate, {
		version: '1.0',
		defaults: {
			controlClass : 'agegate_control'
		}
	});

})(jQuery);
