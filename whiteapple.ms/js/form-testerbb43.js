/**
 * Bind and Trigger custom and native events in Prototype
 * @author Juriy Zaytsev (kangax)
 * @author Benjamin Lupton (balupton)
 * @author V. Furkan Güner
 * @copyright MIT license
 **/

var dummyValues = {
    emails: [
        "john@example.com",
        'alex@example.com',
        'maria@example.com',
        'chris@example.com',
        'sara@example.com',
        'james@example.com'
    ],
    inputGradings: [1, 2, 3, 4, 5],
    maskNumber: [
        '123456789',
        '987654321',
        '564738291',
        '452376189',
        '213478956',
        '678912345'
    ],
    days: ['01', '02', '03', '04', '05', '06'],
    years: ['2016', '2024', '2025', '2026', '2027', '2028'],
    numeric: [123, 234, 345, 456, 567, 678],
    currency: ['$10', '$20', '$30', '$40', '$50', '$60'],
    address_line_1: ['111 Pine Street', '240 Apple Street', '387 Banana Blvd', '450 Grape Lane', '732 Berry Ave', '842 Cherry Road'],
    address_line_2: ['Suite 1815', 'Suite 1023', 'Suite 1468', 'Suite 1234', 'Suite 1374', 'Suite 1623'],
    city: ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'],
    state: ['CA', 'NY', 'LA', 'IL', 'FL', 'WA'],
    zip: ['94111', '10001', '90001', '60007', '33101', '98101'],
    country: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France'],
    names: ['John', 'Alex', 'Maria', 'Chris', 'Sara', 'James'],
    surnames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'],
    textarea: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis ultricies interdum. Nullam pharetra vitae lectus eget volutpat. Integer in sodales ligula. Vestibulum pellentesque arcu in est aliquam rhoncus. Curabitur et dui quis arcu scelerisque congue.",
        "Pellentesque libero ligula, sagittis a tempus quis, finibus eget erat. Nunc sed tempor nunc. Mauris tempor odio id lorem commodo dapibus. Nulla viverra mi in magna imperdiet volutpat.",
        // Additional dummy text can be generated as required
    ],
    numberInput: [1, 2, 3, 4, 5, 6, 7, 8]
};

var isRandomizeActived = window.location.href.indexOf('jfRandomFill=1') > 0;

function getRandomValue(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    var initialIndex = 0;
    var index = isRandomizeActived ? randomIndex : initialIndex;

    return arr[index];
};

function getRandomData(data) {
    return {
        email: getRandomValue(data.emails),
        inputGrading: getRandomValue(data.inputGradings),
        maskNumber: getRandomValue(data.maskNumber),
        day: getRandomValue(data.days),
        year: getRandomValue(data.years),
        numeric: getRandomValue(data.numeric),
        currency: getRandomValue(data.currency),
        address_line_1: getRandomValue(data.address_line_1),
        address_line_2: getRandomValue(data.address_line_2),
        city: getRandomValue(data.city),
        state: getRandomValue(data.state),
        zip: getRandomValue(data.zip),
        country: getRandomValue(data.country),
        name: getRandomValue(data.names),
        surname: getRandomValue(data.surnames),
        textarea: getRandomValue(data.textarea),
        numberInput: getRandomValue(data.numberInput),
    };
}

var randomData = getRandomData(dummyValues);

(function(){

    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|hashchange|popstate|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
    };
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    };

    Event.hasNativeEvent = function(element, eventName) {
        var eventType = null;
        element = $(element);
        for (var name in eventMatchers) {
            if ( eventMatchers[name].test(eventName) ) {
                eventType = name;
                break;
            }
        }
        return eventType ? true : false;
    };

    Event.bind = function(element, eventName, eventHandler) {
        element = $(element);

        if ( Element.hasNativeEvent(element,eventName) ) {
            return Element.observe(element,eventName,eventHandler);
        }
        else {
            return Element.observe(element,'custom:'+eventName,eventHandler);
        }
    };

    Event.simulate = function(element, eventName) {
        var options = Object.extend(defaultOptions, arguments[2] || { });
        var oEvent, eventType = null;

        element = $(element);

        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }

        if ( !eventType ) {
            return Element.fire(element,'custom:'+eventName);
        }

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                    options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            oEvent = Object.extend(document.createEventObject(), options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    };

    Element.addMethods({
        simulate: Event.simulate,
        trigger: Event.simulate,
        bind: Event.bind,
        hasNativeEvent: Event.hasNativeEvent
    });
})();

var targetFieldIDs = [];
if (typeof JotForm.calculations.map === 'function') {
    targetFieldIDs = JotForm.calculations.map(function(obj) { return obj.resultField });
}

//control_textbox
$$(".form-textbox").each(function(el, idx){
    if (el.value || isAlwaysHidden(el)) { return; }
    if(el.tagName==='TABLE' || targetFieldIDs.indexOf(el.id.split('_')[el.id.split('_').length - 1].toString()) >= 0){
        return;
    }

    var val = "textbox_sample" + idx;
    if(el.getAttribute("type")==="email" || el.getAttribute("class").match(/validate\[.*Email.*\]/)){
        val = randomData.email;
    }
    if(el.getAttribute("data-type")==="input-grading"){
        val = randomData.inputGrading;
    }
    if(el.getAttribute("type")==="tel"){
        if(el.getAttribute("data-type")==="mask-number"){
            val = randomData.maskNumber;
        } else {
            val = '';
            if ((!!el.getAttribute("name") && el.getAttribute("name").indexOf("day")  > -1) ||  (!!el.getAttribute("name") && el.getAttribute("name").indexOf("month") > -1)) {
                val = "01";
            } else if (!!el.getAttribute("name") && el.getAttribute("name").indexOf("year")  > -1) {
                val = randomData.year;
            } else if (!!el.getAttribute("format") && !!el.getAttribute("seperator") && el.getAttribute("format").indexOf("yyyy") > -1) {
                var i = 0;
                var today = new Date();
                while(i < el.getAttribute("format").length) {
                    if (el.getAttribute("format")[i] === 'm') {
                        val += (today.getMonth() > 8 ? today.getUTCMonth() + 1 : '0' + (today.getMonth() + 1)) + el.getAttribute("seperator");
                        i += 2;
                    } else if (el.getAttribute("format")[i] === 'd') {
                        val += (today.getUTCDate() > 9 ? today.getUTCDate() : '0' + today.getUTCDate()) + el.getAttribute("seperator");
                        i += 2;
                    } else {
                        val += today.getUTCFullYear() + el.getAttribute("seperator");
                        i += 4;
                    }
                }
                val = val.replace(/-+$/, '');
            } else { 
                val = 312;
            }
        }
    }

    // Fill in masked text inputs
    if((!!el.getAttribute('masked') && el.getAttribute('masked') === 'true') || (!!el.getAttribute('data-masked') && el.getAttribute('data-masked') === 'true')) {
        val = (el.getAttribute('maskvalue').replace(/\*|#/g, 1)).replace(/@/g, 'a');
    }

    if(!!el.className && el.className.match('Numeric')) {
        val = randomData.numeric;
        // Check minimum and maximum length
        var minLength = parseInt(el.getAttribute("data-minlength"), 10) || 0;
        var maxLength = parseInt(el.getAttribute("maxlength"), 10) || Infinity;
        // Check value availability
        if (val.toString().length < minLength) {
            // Show error message for minimum length
            JotForm.errored(el, JotForm.getValidMessage(JotForm.texts.minCharactersError, minLength));
        }
        if (val.toString().length > maxLength) {
            // Show error message for maximum length
            JotForm.errored(el, JotForm.getValidMessage(JotForm.texts.maxCharactersError, maxLength));
        }
    }

    if(!!el.className && el.className.match('Currency')) {
        val = '$11';
    }

    const addressComponents = ["address_line_1", "address_line_2", "city", "state", "zip", "country"];

    if (!!el.getAttribute("data-component")  && addressComponents.includes(el.getAttribute("data-component"))) {
        if (el.getAttribute("required") === null) { return; }
        if (el.getAttribute("data-component") === "address_line_1") {
            val = randomData.address_line_1;
        }

        if (el.getAttribute("data-component") === "address_line_2") {
            val = randomData.address_line_2;
        }

        if (el.getAttribute("data-component") === "city") {
            val = randomData.city;
        }

        if (el.getAttribute("data-component") === "state") {

            val = randomData.state;
        }

        if (el.getAttribute("data-component") === "zip") {
            val = randomData.zip;
        }

        if (el.getAttribute("data-component") === "country") {
            val = randomData.country;
        }
    }

    if(!!el.className && el.className.match('Url')) {
        val = 'https://www.jotform.com/';
    }

    if (!!el.getAttribute('name') && !!el.getAttribute('name').match(/name\[\w+\]/gm)) {
      if (el.getAttribute('name').indexOf('first') > -1) {
        val = randomData.name;
      } else {
        val = randomData.surname;
      }
    }

    if(el.getAttribute("type")==="text" && el.getAttribute("class").match(/validate\[.*limitDate.*\]/)){
        const question_id = el.id.split('_')[el.id.split('_').length - 1].toString();
        JotForm.formatDate({date: (new Date()), dateField: $("id_"+question_id)});
    } else {
        $(el).value = val;
        setTimeout(function() {
            $(el).simulate('change');
        }, 10 * idx);
    }
});

//control_textarea
$$(".form-textarea").each(function(el, idx){
    if (el.value || isAlwaysHidden(el)) { return; }
    var val = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis ultricies interdum. Nullam pharetra vitae lectus eget volutpat. Integer in sodales ligula. Vestibulum pellentesque arcu in est aliquam rhoncus. Curabitur et dui quis arcu scelerisque congue. Pellentesque libero ligula, sagittis a tempus quis, finibus eget erat. Nunc sed tempor nunc. Mauris tempor odio id lorem commodo dapibus. Nulla viverra mi in magna imperdiet volutpat.";
    el.value=val;
    if (el.hasClassName('mdInput')) {
        var id = el.getAttribute("id");
        var textAreaDiv = el.parentNode ? el.parentNode.querySelector(id+'_editor') : null;
        if (textAreaDiv) {
            textAreaDiv.innerHTML = val;
            textAreaDiv.value = val;
        }
    }
})
//control_dropdown
$$(".form-dropdown").each(function(el, idx){
    if (el.value || isAlwaysHidden(el)) { return; }
    var vals = [];
    var fillIndex = el.hasClassName('cc_exp_year') ? 3 : 1;
    $(el).select("option").each(function(el, idx){
        vals.push(el.value);
        if (idx === fillIndex) {
            el.setAttribute("selected", "selected");
        }
    });
    el.value = vals[fillIndex];

    if (window.FORM_MODE === 'cardform' && el.classList.contains('time-dropdown')) {
        el.triggerEvent('change');
    }

});
//control_radio
$$(".form-single-column").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    var radios = $(el).select(".form-radio-item");
    if(radios.length>0){
        var r = $(radios[0]).select(".form-radio")[0];
        r.setAttribute("checked", true);
    }
});

$$(".form-multiple-column").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    var radios = $(el).select(".form-radio-item");
    if(radios.length>0){
        var r = $(radios[0]).select(".form-radio")[0];
        r.setAttribute("checked", true);
    }
});

//control_checkbox
$$(".form-single-column").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    var checks = $(el).select(".form-checkbox-item");
    if(checks.length>0){
        var count = $(checks[0]).select(".form-checkbox")[0].readAttribute('data-minselection') || 1;
        for(;count>0;count--) { 
            $(checks[count-1]).select(".form-checkbox")[0].setAttribute("checked", true);
        }
    }
});

$$(".form-multiple-column").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    var checks = $(el).select(".form-checkbox-item");
    if(checks.length>0){
        var r = $(checks[0]).select(".form-checkbox")[0];
        r.setAttribute("checked", true);
    }
});


//control_nmber
$$(".form-number-input").each(function(el, idx){
    if (el.value || isAlwaysHidden(el)) { return; }
    var val= 1;
    if(el.getAttribute("data-numbermin")!==null){
        val = parseInt(el.getAttribute("data-numbermin"),10)+1;
    }
    el.value = val;
});
//control_rating
$$(".form-star-rating").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    $(el).select("div")[0].click();
});
//control_scale
$$(".form-scale-table").each(function(el, idx){
    if (isAlwaysHidden(el)) { return; }
    $(el).select(".form-radio")[0].click();
});
//control_slider
$$("table.form-textbox").each(function(el,idx){
    if (isAlwaysHidden(el)) { return; }
    var inp = $(el).previous();
    if(inp.value) { return; }
    inp.value = 1;
});
//control_range
$$(".form-spinner").each(function(el,idx){
    if (isAlwaysHidden(el)) { return; }
    $(el).select("input").each(function(el, idx){
        if(el.value) { return; }
        el.value = idx+3;
    });
});
//control_matrix
$$(".form-matrix-table").each(function(el,idx){
    if (isAlwaysHidden(el)) { return; }
    $(el).select("tr").each(function(tr, idx){
        if(idx>0){
            $(tr).select("input").each(function(inp, idx){
                inp.setAttribute("checked", true);
            });
        }
    });
});

//control_yesno
$$("li[data-type=control_yesno]").each(function(el, idx){
    if (el.hasClassName('always-hidden')) { return; }
    var options = $(el).select(".jfYesno");
    if(options.length>0){
        var firstOpt = $(options[0]);
        firstOpt.setAttribute("aria-checked", true);
        var radio = firstOpt.select(".form-radio")[0];
        radio.setAttribute("checked", true);
        var parent = firstOpt.parentNode;
        if (parent.hasClassName('jfField')) {
            parent.addClassName('isFilled');
        }
    }
});

$$('input.time-dropdown').each(function(el, idx) {
    if (isAlwaysHidden(el)) { return; }

    el.value = (new Date()).toTimeString().slice(0,5);
})

// Fill in credit card details
$$(".cc_number").each(function(el,idx){
    if(el.value) { return; }
    $(el).value = "4242424242424242";
});
$$(".cc_ccv").each(function(el,idx){
    if(el.value) { return; }
    $(el).value = "324";
});
$$(".cc_exp_year").each(function(el,idx){
    if(el.value) { return; }
    $(el).value = "2020";
});

// 2checkout - paypal - stripe
$$("li[data-type=control_2co]").each(commonPaymentFiller);
$$("li[data-type=control_paypal]").each(commonPaymentFiller);
$$("li[data-type=control_stripe]").each(commonPaymentFiller);
$$("li[data-type=control_authnet]").each(commonPaymentFiller);
$$("li[data-type=control_payment]").each(commonPaymentFiller);


function commonPaymentFiller(el, idx) {
    el.select('.form-checkbox').each(function(e, i) {
        e.setAttribute("checked", true);
        e.triggerEvent("click");
    });

    // donation forms
    if (el.match('.donation_cont')) {
        el.select('input[id*="_donation"]')[0].triggerEvent("input");
    }

    if (el.select('.form-radio').length > 0) {
        el.select('.form-radio')[0].setAttribute("checked", true);
        el.select('.form-radio')[0].triggerEvent("click");
        if (window.FORM_MODE === 'cardform') {
            el.select('.form-radio')[0].click();
        }
    }
};

function isAlwaysHidden(el) {
    return !!el.up('li.always-hidden');
}


