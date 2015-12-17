/**
 * Плагин для jquery plus / minus инкрементер для input
 * @usage $('input').increments();
 * @author Александр Хрищанович
 * @version 1.0
 * @html
 	<div class="increments">
 		<input type="text" value="1" data-increment="0.1" data-measure="кг">
 		<div class="increments_measure">кг</div>
 		<a href="#" class="minus"></a>
 		<a href="#" class="plus"></a>
 	</div>
 */
(function ($) {

	$.fn.increments = function(options) {

		var options = $.extend({}, $.fn.increments.defaults, options);
		
		var _mouseDownTimer = null;
		
		var _roundToNumber = function(number, divNumber){
			
			var _number = Math.round(number * 1000) / 1000,
				_return = divNumber * Math.round(_number / divNumber);
				
			return Math.round(_return * 1000) / 1000;

		}

		/**
		 * Обработчик ссылки plus
		 * @param object input	Элемент input который будет изменяться
		 */
		var _plusClick = function (input) {
			
			var _input = $(input),
				_incValue =  _input.data('increment');

			_incrementInput(_input, _incValue);
			
			clearTimeout(_mouseDownTimer);
			_mouseDownTimer = setTimeout(function () {
				_plusClick(input);
			}, 200);
			
		}

		/**
		 * Обработчик ссылки minus
		 * @param object input	Элемент input который будет изменяться
		 */
		var _minusClick = function (input) {
			
			var _input = $(input),
				_incValue =  _input.data('increment');

			_incrementInput(_input, -_incValue);
			
			clearTimeout(_mouseDownTimer);
			_mouseDownTimer = setTimeout(function () {
				_minusClick(input);
			}, 200);
			
		}

		/**
		 * Изменяем значение инпута
		 * @param object input	Элемент input который будет изменяться
		 * @param float increment	На сколько добавляем / отнимаем
		 */
		var _incrementInput = function (input, increment) {
			
			var _currentVal = parseFloat($(input).val()),
				_newVal = _currentVal + increment;

			_setVal(input, _newVal);

		}

		/**
		 * Получаем ссылку на обертку
		 * @param object object	Ребёнок
		 * @return object
		 */
		var _getWrapper = function (object) {
			return $(object).parent('.increments');
		}

		/**
		 * Устанавливаем значение инпута
		 * @param object input	Элемент input который будет изменяться
		 * @param float value	Значение
		 */
		var _setVal = function (input, value) {
			
			var value = Math.round(value * 1000) / 1000,
				value = isNaN(value) ? 1 : value,
				value = _roundToNumber(value, $(input).data('increment')),
				_max = parseFloat($(input).data('max')),
				_min = parseFloat($(input).data('min'));
								
			if (!isNaN(_max) && value > _max) value = _max;
			if (!isNaN(_min) && value < _min) value = _min;
			
			$(input).val(value);
			
			if (typeof(options.callbackChange) == 'function') options.callbackChange(value, input);

		}

	    return this.each(function() {
			
	    	if ($(this).data('increments')) return;
	    	$(this).data('increments', 1);

	    	$(this)
	    		.wrap('<div class="increments"/>')
	    		.after('<a class="plus" href="#"/>')
	    		.after('<a class="minus" href="#"/>');

	    	$(this).data('measure')
	    		? $(this).after('<div class="increments_measure">' + $(this).data('measure') + '</div>')
	    		: false;
	    		
	    	var _input = $('input', _getWrapper(this));
	    	
	    	$('.increments_measure', _getWrapper(this)).click(function () {
	    		_input.focus();
	    		return false;
	    	});

	    	$('.plus', _getWrapper(this)).mousedown(function () {
	    		_plusClick(_input);
	    		return false;
	    	});
	    	$('.minus', _getWrapper(this)).mousedown(function () {
	    		_minusClick(_input);
	    		return false;
	    	});
	    	$('.plus, .minus').on('click mousemove', function (event) { 
	    		clearTimeout(_mouseDownTimer);
	    		event.preventDefault();
	    		return false;
	    	});
		    	
		    $('input', _getWrapper(this)).change(function () {
	    		_setVal(this, $(this).val());
	    	});

	    });

	};
	
	$.fn.increments.defaults = {
		callbackChange: function () { }
	};
	
})(jQuery);