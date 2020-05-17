const ADJUSTMENT_CLASSES = ["selected", "unselected"];
const SECTION_CLASSES = ["home", "projects", "interests", "contact"];

const NAV_ID = "navbar";
const CONTENT_ID = "content";

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
const appDiv = "content";

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
    console.log('in route');
    console.log(path);
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
// // Register the templates.
// template('template1', () => {
//     let myDiv = document.getElementById(appDiv);
//     myDiv.innerHTML = "";
//     const link1 = createLink('view1', 'Go to view1', '#/view1');
//     const link2 = createLink('view2', 'Go to view2', '#/view2');
//     myDiv.appendChild(link1);
//     return myDiv.appendChild(link2);
// });
// template('template-view1', () => {
//     let myDiv = document.getElementById(appDiv);
//     myDiv.innerHTML = "";
//     const link1 = createDiv('view1', "<div><h1>This is View 1 </h1><a href='#/'>Go Back to Index</a></div>");
//     return myDiv.appendChild(link1);
// });
// template('template-view2', () => {
//     let myDiv = document.getElementById(appDiv);
//     myDiv.innerHTML = "";
//     const link2 = createDiv('view2', "<div><h1>This is View 2 </h1><a href='#/'>Go Back to Index</a></div>");
//     return myDiv.appendChild(link2);
// });
// // Define the mappings route->template.
// route('/', 'template1');
// route('/view1', 'template-view1');
// route('/view2', 'template-view2');
// console.log('routes should be defined');
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
let resolveRoute = (path) => {
    console.log('in resolveRoute');
    console.log(path);
    try {
        console.log('in try');
        console.log(routes);
        console.log(routes[path]);
     return routes[path];
    } catch (error) {
        throw new Error("The route is not defined");
    }
};
// The actual router, get the current URL and generate the corresponding template
let router = (evt) => {
    console.log('in router');
    const url = window.location.hash.slice(1) || "/";
    const routeResolved = resolveRoute(url);
    console.log(routeResolved);
    routeResolved();
};

let loadPage = (evt) => {
    const url = window.location.hash.slice(1) || "/";
    console.log('current url');
    console.log(url);
    var xobj = new XMLHttpRequest(); // https://www.quora.com/How-do-I-load-a-true-JSON-file-using-pure-JavaScript
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            const data = JSON.parse(xobj.responseText);

            // load nav bar
            let navbar = document.getElementById(NAV_ID);
            navbar.innerHTML = "";
            const hamburger = document.createElement('label');
            hamburger.id = "hamburger";
            hamburger.setAttribute("for", "toggle");
            hamburger.append('&#9776');
            navbar.append(hamburger);
            const headerElement = document.createElement('div');
            headerElement.id = "nav-header";
            const headerLink = createLink(data.title, data.title, '/');
            headerElement.append(headerLink);
            navbar.append(headerElement);
            console.log(navbar);
            const navItems = document.createElement('ul');
            navItems.id = "nav-items";
            for (var navItem of data.nav) {
                const listItem = document.createElement('li');
                listItem.setAttribute('class', 'nav-item');
                listItem.id = navItem.section + "-tab";
                const link = createLink(navItem.title, navItem.title, "/#"+navItem.link);
                listItem.append(link);
                navItems.append(listItem);
            }
            navbar.append(navItems);
            console.log(navbar);

            // load in the pages
            // const thisSectionUrl = window.location.hash.slice(1) || "/";
            // const section = data.sections[thisSectionUrl];
 
            // route(thisSectionUrl, section.id);

            for (var section of data.sections) {
                template(section.id, () => {
                    let contentDiv = document.getElementById("content");
                    contentDiv.innerHTML = "";
                    let topDiv = document.createElement("div");
                    topDiv.setAttribute("id", "top-div");
                    let textDiv = document.createElement("div");
                    textDiv.setAttribute("id", "text-div");
                    if ("header" in section) {
                        const header = document.createElement("h1");
                        header.innerText = section.header;
                        textDiv.append(header);
                    }
                    if ("subheader" in section) {
                        const subheader = document.createElement("h2");
                        subheader.innerText = section.subheader;
                        textDiv.append(subheader);
                    }
                    if ("image" in section) {
                        const image = document.createElement("img");
                        image.src = section.image;
    
                        if ("toparrange" === "image-first") {
                            topDiv.append(image);
                            topDiv.append(textDiv);
                        } else { // if "toparrange" === "image-second"
                            topDiv.append(textDiv);
                            topDiv.append(image);
                        }
                        contentDiv.append(topDiv);
                    } else {
                        topDiv.append(textDiv);
                        contentDiv.append(topDiv);
                    }
    
                    // now the rest of the page items: links or items
                    if ("items" in section) {
                        const itemsDiv = document.createElement("div");
                        for (var item of items) {
                            const itemDiv = document.createElement("div");
                            item.setAttribute("id", section.id);
                            const title = document.createElement("h2");
                            title.setAttribute("class", section.id + "-header");
                            title.innerText = item.title;
                            itemDiv.append(title);
    
                            const info = document.createElement("div");
                            info.setAttribute("class", section.id + "-info");
                            const timeline = document.createElement("h2");
                            timeline.innerText = item.timeline;
                            info.append(timeline);
                            const description = document.createElement("h2");
                            description.innerText = item.description;
                            info.append(description);
                            const image = document.createElement("img");
                            image.src = item.image;
                            info.append(image);
    
                            itemDiv.append(info);
    
                            itemsDiv.append(itemDiv);
                        }
                        contentDiv.append(itemsDiv);
                    }
    
                    if ("links" in section) {
                        console.log('we have some links!');
                        const linksDiv = document.createElement("div");
                        for (var link of section.links) {
                            const linkDiv = document.createElement("a");
                            linkDiv.href = "/#" + link.link;
                            const name = document.createElement("h4");
                            name.innerText = link.name;
                            linkDiv.append(name);
                            const img = document.createElement("img");
                            img.src = link.img;
                            linkDiv.append(img);
                            linksDiv.append(linkDiv);
                        }
                        console.log(linksDiv);
                        contentDiv.append(linksDiv);
                    }
                    return contentDiv;
                });
                route(section.link, section.id);
            }
            console.log('templates');
            console.log(templates);

            // // Register the templates.
            // template('template1', () => {
            //     let myDiv = document.getElementById(appDiv);
            //     myDiv.innerHTML = "";
            //     const link1 = createLink('view1', 'Go to view1', '#/view1');
            //     const link2 = createLink('view2', 'Go to view2', '#/view2');
            //     myDiv.appendChild(link1);
            //     return myDiv.appendChild(link2);
            // });
            // template('template-view1', () => {
            //     let myDiv = document.getElementById(appDiv);
            //     myDiv.innerHTML = "";
            //     const link1 = createDiv('view1', "<div><h1>This is View 1 </h1><a href='#/'>Go Back to Index</a></div>");
            //     return myDiv.appendChild(link1);
            // });
            // template('template-view2', () => {
            //     let myDiv = document.getElementById(appDiv);
            //     myDiv.innerHTML = "";
            //     const link2 = createDiv('view2', "<div><h1>This is View 2 </h1><a href='#/'>Go Back to Index</a></div>");
            //     return myDiv.appendChild(link2);
            // });
            // Define the mappings route->template.
            // route('/', 'template1');
            // route('/view1', 'template-view1');
            // route('/view2', 'template-view2');
            console.log('routes should be defined');

            router(evt);

        }
    };
    xobj.send(null); 

}
// For first load or when routes are changed in browser url box.
window.addEventListener('load', loadPage);
window.addEventListener('hashchange', router);