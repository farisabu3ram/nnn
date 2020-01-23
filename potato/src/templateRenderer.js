// Define global variables
let $scope = {};
let $functions;
let $testedSpecials = [];
let $bindedVars;
let viewElement = document.querySelector('[view]');
let cm = new Map();
let id = 0;

// Classes
// Holds data required to a special atributes
class AttrData {
	constructor(query, render) {
		this.type = query.replace("\\", "").replace("\$", "");
		this.query = query;
		this.render = render;
	}
}

// Special attribute class
class SpecialAttr {
	constructor(type, element, render) {
		this.attr = type;
		this.element = element;
		this.exp = element.getAttribute("$" + type);
		this.render = render;
	}
}

//*********************************************************************//
//************************* Special Renders ***************************//
//*********************************************************************//

// Render function for "$if" special attribute 
function renderIf(expression, element) {
	let exp = expression.replace(/\$/g, "$scope.");
	//check the expression in if attribute.  
	let result = eval(exp);
	//check if the expression true then the hide class will be removed if exist to display the element
	if (result) {
		if (element.classList.contains('hide')) {
			element.classList.remove('hide');
		}
	}
	//if false we will add hide class to hide the element.
	else {
		if (!element.classList.contains('hide')) {
			element.classList.add('hide')
		}
	}
}

// Render function for "$for" special attribute 
function renderFor(exp, element) {
	// define the iteration symbol of this for loop
	let def = exp.split(':');
	let iterSymbol = 'i';
	if (def.length > 1)
		iterSymbol = def[1].trim();

	// define array and the element
	let subArr = def[0].split('of')[0].trim();
	let arrName = def[0].split('of')[1].trim();

	let array = eval('$scope.' + arrName);
	if (!array) return;
	let iterregx = new RegExp(`\\$` + iterSymbol + '(?![a-z])', 'g');

	let newElement = "";

	for (let i = 0; i < array.length; i++) {
		let tempele = element.innerHTML.replace(new RegExp("\[$]" + subArr, 'g'), "$" + arrName + `[${i}]`).replace(iterregx, i);
		let oldval = $scope[subArr];
		$scope[subArr] = array[i];

		var node = document.createElement("LI");
		node.innerHTML = tempele;
		renderTemplate(node);
		$apply(node);
		tempele = node.innerHTML;

		$scope[subArr] = oldval;
		newElement += tempele;
	}

	element.innerHTML = newElement;
}

// Render function for "$disabled" special attribute 
function renderDisabled(exp, element) {
	exp = exp.replace(/\$/g, "$scope.");
	let result = eval(exp);
	element.disabled = result;
}

// Render function for "$style" special attribute 
function renderStyle(exp, element) {
	let hashCode = function (str) {
		var hash = 0;
		if (str.length == 0) {
			return hash;
		}
		for (var i = 0; i < str.length; i++) {
			var char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return hash;
	}

	let expGroup = exp.split(',');

	expGroup.forEach(ele => {
		let indx = ele.lastIndexOf(":");
		let e = [];
		e.push(ele.substring(0, indx).replace(/'/g, "").trim(), ele.substring(indx + 1).trim());

		let h = "mvc" + hashCode(e[0]);

		createClass(h, e[0]);

		renderClass(`${h} : ${e[1]}`, element);
	});
}

// Render function for "$class" special attribute 
function renderClass(exp, element) {
	exp = exp.replace(/\$/g, "$scope.");
	let expGroup = exp.split(',');

	expGroup.forEach(ele => {
		let splitStr = ele.split(":")
		let className = splitStr[0].replace(/'/g, "").trim();
		if (eval(splitStr[1]))
			element.classList.add(className);
		else
			element.classList.remove(className);
	}
	);
}

//Render function for "$click" special attribute.
function renderClick(exp, element) {
	let id = uniqueId();
	element.setAttribute('id', id);
	exp = exp.replace(/\$/g, "$scope.");
	eventListener(id, 'click', () => { eval('$functions.' + exp); });
}

function renderModel(exp, element) {
	element.setAttribute('id', exp);
    element.setAttribute('value', $scope[exp]);
    eventListener(element, 'change', () => { $scope[exp] = document.getElementById(exp).value; });
}

//Render function for "$change" special attribute.
function renderChange(exp, element) {
	let id = uniqueId();
	element.setAttribute('id', id);
	exp = exp.replace(/\$/g, "$scope.");
	eventListener(id, 'change', () => { eval('$functions.' + exp); });
}

//*********************************************************************//
//*********************************************************************//
//*********************************************************************//

// List of all special tags with their render functionality
const specails = [
	new AttrData("\\$for", renderFor),
	new AttrData("\\$if", renderIf),
	new AttrData("\\$disabled", renderDisabled),
	new AttrData("\\$style", renderStyle),
	new AttrData("\\$class", renderClass),
	new AttrData("\\$click", renderClick),
	new AttrData("\\$model", renderModel),
	new AttrData("\\$change", renderChange)
];

// Pulls special tags from a given html
function specialTags(doc) {
	let specialTags = [];

	// Find all special tags and format them
	for (let i = 0; i < specails.length; i++) {
		let elements = doc.querySelectorAll(`[${specails[i].query}]`);
		elements = [...elements].map(element => element = new SpecialAttr(specails[i].type, element, specails[i].render));
		specialTags = specialTags.concat(elements);
	}

	return specialTags;
}

// Executes {{exp}} using data of a model
function replaceElement(attrString) {
	let value = attrString.replace('$', "$scope.");
	value = eval(value);
	return value == undefined ? '' : value;
}

// Replace the binded variable with its real value in html
export function $apply(doc) {
	let str;
	if (!doc) {
		str = $bindedVars;
		doc = viewElement;
	}
	else {
		str = doc.innerHTML;
	}
	str = str.replace(/(\{\{.*?\}\})/g, replaceElement);
	doc.innerHTML = str;
	return doc;
}

// Used by renderStyle
function createClass(name, attr) {
	if (cm.has(name))
		return;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `.${name} { ${attr} }`;
	document.getElementsByTagName('head')[0].appendChild(style);

	cm.set(name, true);
}

// Used by renderFor
function renderTemplate(view) {
	let specials = specialTags(view);
	specials.forEach(element => {
		if ($testedSpecials.filter(elem => elem.element.isEqualNode(element.element) && elem.attr == element.attr).length == 0) {
			$testedSpecials.push(element);
			return element.render(element.exp, element.element);
		}
	});
}

export function render(view, model, functions) {
	$scope = model;
	$functions = functions;
	$bindedVars = view.innerHTML;
	renderTemplate(view);
	$apply(view);
	return view;
}

function uniqueId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
};

function eventListener(id, event, func) {
	document.addEventListener(event, ev => {
		if (ev.target.getAttribute("id") != id) return;
		ev.preventDefault();
		func();
	});
}