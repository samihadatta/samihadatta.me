const ADJUSTMENT_CLASSES = ["selected", "unselected"];
const SECTION_CLASSES = ["home", "projects", "interests", "contact"];

function navigateToSectionWithId(sectionId) {
    const url = "/"+sectionId;
    history.pushState(
        { id: sectionId },
        sectionId,
        url
    )
    // set all other sections to unselected
    var sections = document.getElementsByClassName("section");
    for (var i = 0; i < sections.length; i++ ) {
        var classes = getNotAdjustmentClasses(sections[i]);
        classes += " unselected";
        sections[i].setAttribute("class", classes);
    }
    
    // set this section to selected
    var thisSectionClasses = getNotAdjustmentClasses(document.getElementById(sectionId));
    thisSectionClasses += " selected";
    document.getElementById(sectionId).setAttribute("class", thisSectionClasses);
}

function navigateToNewSection(event)  {
    var thisSectionId = event.target.getAttribute("id").replace("-tab", "");
    navigateToSectionWithId(thisSectionId);
}

function getNotAdjustmentClasses(el) {
    var newClasses = "";
    var classes = el.getAttribute("class")
    classes = classes.split(" ");
    for (var j = 0; j < classes.length; j++) {
        newClass = classes[j];
        if (isAdjustmentClass(newClass) === false) {
            newClasses += " " + newClass;
        }
    }
    return newClasses;
}

function isAdjustmentClass(classToCheck) {
    for (var k = 0; k < ADJUSTMENT_CLASSES.length; k++) {
        if (ADJUSTMENT_CLASSES[k] === classToCheck) {
            return true;
        }
    }
    return false;
}


// rewrite this logic!!!

function getSectionClass(el) {
    var classes = element.getAttribute("class");
    classes = classes.split(" ");
    for (var i = 0; j < classes.length; j++) {
        if (isSectionClass(classes[i])) {
            return classes[i];
        }
    }
    return "none";
}

function isSectionClass(className) {
    for (var j = 0; j < SECTION_CLASSES.length; j++) {
        if (className === SECTION_CLASSES[j]) {
            return true;
        }
    }
    return false;
}



// JavaScript routing. adapted from https://medium.com/@fro_g/routing-in-javascript-d552ff4d2921

// Application div
const appDiv = "app";

// Both set of different routes and template generation functions
let routes = {};
let templates = {};

// Register a template (this is to mimic a template engine)
let template = (name, templateFunction) => {
  return templates[name] = templateFunction;
};

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
let route = (path, template) => {
    if (typeof template == "function") {
      return routes[path] = template;
    }
    else if (typeof template == "string") {
      return routes[path] = templates[template];
    }
    else {
      return;
    }
};
// Register the templates.
template('home', () => {
    let myDiv = document.getElementById("home");
    myDiv.innerHTML = "";
    const link1 = createLink('view1', 'Go to view1', '#/view1');
    const link2 = createLink('view2', 'Go to view2', '#/view2');
    myDiv.appendChild(link1);
    return myDiv.appendChild(link2);
    return document.getElementById("home");
});
template('projects', () => {
    // let myDiv = document.getElementById(appDiv);
    // myDiv.innerHTML = "";
    // const link1 = createDiv('view1', "<div><h1>This is View 1 </h1><a href='#/'>Go Back to Index</a></div>");
    // return myDiv.appendChild(link1);
    return document.getElementById("projects")
});
template('interests', () => {
    let myDiv = document.getElementById(appDiv);
    myDiv.innerHTML = "";
    const link2 = createDiv('view2', "<div><h1>This is View 2 </h1><a href='#/'>Go Back to Index</a></div>");
    return myDiv.appendChild(link2);
});
template('contact', () => {
    let myDiv = document.getElementById(appDiv);
    myDiv.innerHTML = "";
    const link2 = createDiv('view2', "<div><h1>This is View 2 </h1><a href='#/'>Go Back to Index</a></div>");
    return myDiv.appendChild(link2);
});
// Define the mappings route->template.
route('/', 'home');
route('/projects', 'projects');
route('/view2', 'template-view2');
// Generate DOM tree from a string
let createDiv = (id, xmlString) => {
    let d = document.createElement('div');
    d.id = id;
    d.innerHTML = xmlString;
    return d.firstChild;
};
// Helper function to create a link.
let createLink = (title, text, href) => {
    let a = document.createElement('a');
    let linkText = document.createTextNode(text);
    a.appendChild(linkText);
    a.title = title;
    a.href = href;
    return a;
};

// Give the correspondent route (template) or fail
let resolveRoute = (route) => {
    try {
     return routes[route];
    } catch (error) {
        throw new Error("The route is not defined");
    }
};
// The actual router, get the current URL and generate the corresponding template
let router = (evt) => {
    const url = window.location.hash.slice(1) || "/";
    const routeResolved = resolveRoute(url);
    routeResolved();
};
// For first load or when routes are changed in browser url box.
window.addEventListener('load', router);
window.addEventListener('hashchange', router);