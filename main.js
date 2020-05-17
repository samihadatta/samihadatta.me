// const ADJUSTMENT_CLASSES = ["selected", "unselected"];

const NAV_ID = "navbar";
const CONTENT_ID = "content";
const FOOTER_ID = "footer";
let PATH_TO_ID = {};

function navigateToSectionWithId(sectionId) {
    const url = "/"+sectionId;
    history.pushState(
        { id: sectionId },
        sectionId,
        url
    )
    // set all other sections to unselected
    let sections = document.getElementsByClassName("section");
    for (let i = 0; i < sections.length; i++ ) {
        let classes = getNotAdjustmentClasses(sections[i]);
        classes += " unselected";
        sections[i].setAttribute("class", classes);
    }
    
    // set this section to selected
    let thisSectionClasses = getNotAdjustmentClasses(document.getElementById(sectionId));
    thisSectionClasses += " selected";
    document.getElementById(sectionId).setAttribute("class", thisSectionClasses);
}

function navigateToNewSection(event)  {
    let thisSectionId = event.target.getAttribute("id").replace("-tab", "");
    navigateToSectionWithId(thisSectionId);
}

function getNotAdjustmentClasses(el) {
    let newClasses = "";
    let classes = el.getAttribute("class")
    classes = classes.split(" ");
    for (let j = 0; j < classes.length; j++) {
        newClass = classes[j];
        if (isAdjustmentClass(newClass) === false) {
            newClasses += " " + newClass;
        }
    }
    return newClasses;
}

function isAdjustmentClass(classToCheck) {
    for (let k = 0; k < ADJUSTMENT_CLASSES.length; k++) {
        if (ADJUSTMENT_CLASSES[k] === classToCheck) {
            return true;
        }
    }
    return false;
}


// rewrite this logic!!!

function getSectionClass(el) {
    let classes = element.getAttribute("class");
    classes = classes.split(" ");
    for (let i = 0; j < classes.length; j++) {
        if (isSectionClass(classes[i])) {
            return classes[i];
        }
    }
    return "none";
}

function isSectionClass(className) {
    for (let j = 0; j < PATH_TO_ID.length; j++) {
        if (className === PATH_TO_ID[j]) {
            return true;
        }
    }
    return false;
}



// JavaScript routing. adapted from https://medium.com/@fro_g/routing-in-javascript-d552ff4d2921

// Application div
const appDiv = CONTENT_ID;

// Both set of different routes and template generation functions
let routes = {};
let templates = {};

// Register a template (this is to mimic a template engine)
let template = (section, templateFunction) => {
    // console.log('in template function');
    // console.log('section');
    // console.log(section);
    // console.log('section id');
    // console.log(section.id);
    // console.log('function');
    // console.log(templateFunction);
  return templates[section.id] = templateFunction(section);
};

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
let route = (path, template) => {
    console.log('in route');
    console.log(path);
    console.log(template);
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
        // console.log('in try');
        // console.log(routes);
        // console.log(routes[path]);
        navigateToSectionWithId(PATH_TO_ID[path]);
     return routes[path];
    } catch (error) {
        throw new Error("The route is not defined");
        return routes["/"];
    }
};
// The actual router, get the current URL and generate the corresponding template
let router = (evt) => {
    console.log('in router');
    const url = window.location.hash.slice(1) || "/";
    resolveRoute(url);
    console.log('route: ' + url);
};

let templateTemplate = (section) => {
    console.log("SECTION inside");
    console.log(section);
    let contentDiv = document.createElement(section.id);
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
        for (let item of section.items) {
            const itemDiv = document.createElement("div");
            itemDiv.setAttribute("id", section.id);
            const title = document.createElement("h2");
            title.setAttribute("class", section.id + "-header");
            title.innerText = item.title;
            itemDiv.append(title);

            const info = document.createElement("div");
            info.setAttribute("class", section.id + "-info");
            const timeline = document.createElement("h3");
            timeline.innerText = item.timeline;
            timeline.setAttribute("class", "timeline");
            info.append(timeline);
            const tech = document.createElement("h3");
            tech.innerText = item.tech;
            tech.setAttribute("class", "tech");
            info.append(tech);
            const description = document.createElement("p");
            description.innerText = item.description;
            info.append(description);
            const image = document.createElement("img");
            image.src = item.image;
            info.append(image);

            itemDiv.append(info);

            itemsDiv.append(itemDiv);
        }
        contentDiv.append(itemsDiv);
        return contentDiv;
    }

    if ("links" in section) {
        console.log('we have some links!');
        const linksDiv = document.createElement("div");
        linksDiv.setAttribute("class", "links");
        for (let link of section.links) {
            const linkDiv = document.createElement("a");
            linkDiv.href = "/#" + link.link;
            linkDiv.setAttribute("class", "link");
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
    let containerDiv = document.getElementById("container");
    containerDiv.appendChild(contentDiv);
}

let loadPage = (evt) => {
    fetch('data.json')
    .then((response) => {
        // if (xobj.readyState == 4 && xobj.status == "200") {
        //     const data = JSON.parse(xobj.responseText);
            const data = response.json().then((data) => {
                console.log(data);
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
            const navItems = document.createElement('div');
            navItems.id = "nav-items";
            for (let navItem of data.nav) {
                const link = createLink(navItem.title, navItem.title, "/#"+navItem.link);
                link.setAttribute('class', 'nav-item');
                link.id = navItem.section + "-tab";
                navItems.append(link);
            }
            navbar.append(navItems);
            console.log(navbar);

            // load footer
            let footer = document.getElementById(FOOTER_ID);
            footer.innerHTML = "";
            for (let footerLink of data.footer) {
                const link = document.createElement("a");
                link.href = footerLink.link;
                link.target = "_blank";
                const icon = document.createElement("i");
                icon.setAttribute("class", footerLink.icon);
                link.append(icon);
                footer.append(link);
            }

            // load in the pages
            // const thisSectionUrl = window.location.hash.slice(1) || "/";
            // const section = data.sections[thisSectionUrl];
 
            // route(thisSectionUrl, section.id);

            for (let sectionLoop of data.sections) {
                // console.log("section outside function");
                // console.log(sectionLoop);
                PATH_TO_ID[sectionLoop.link] = sectionLoop.id;
                template(sectionLoop, (section) => {
                    console.log("SECTION inside");
                    console.log(section);
                    let contentDiv = document.createElement("div");
                    contentDiv.setAttribute("id", section.id);
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
                        for (let item of section.items) {
                            const itemDiv = document.createElement("div");
                            itemDiv.setAttribute("class", section.style.item);
                            const title = document.createElement("h2");
                            title.setAttribute("class", section.id + "-header");
                            title.innerText = item.title;
                            itemDiv.append(title);
                
                            const info = document.createElement("div");
                            info.setAttribute("class", section.id + "-info");
                            const timeline = document.createElement("h3");
                            timeline.innerText = item.timeline;
                            timeline.setAttribute("class", "timeline");
                            info.append(timeline);
                            const tech = document.createElement("h3");
                            tech.innerText = item.tech;
                            tech.setAttribute("class", "tech");
                            info.append(tech);
                            const description = document.createElement("p");
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
                        linksDiv.setAttribute("class", "links");
                        for (let link of section.links) {
                            const linkDiv = document.createElement("a");
                            linkDiv.href = "/#" + link.link;
                            linkDiv.setAttribute("class", "link");
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
                    let containerDiv = document.getElementById(CONTENT_ID);
                    containerDiv.append(contentDiv);
                });
                    // console.log('out of template');
                    // console.log(templates[sectionLoop.id]);
                    route(sectionLoop.link, sectionLoop.id);
                    // console.log('end of loop');
                    // console.log(sectionLoop.id);
                    // console.log(template[sectionLoop.id]);
                }
                console.log('templates');
                console.log(templates);
                console.log('for projects');
                console.log(templates["projects"]);
                console.log('for home');
                console.log(templates["home"]);
                console.log('for about');
                console.log(templates["about"]);
                console.log('for work');
                console.log(templates["work"]);

                router(evt);

                console.log("routes");
                console.log(routes);
        });
    });
    // xobj.send(null); 

}
// For first load or when routes are changed in browser url box.
window.addEventListener('load', loadPage);
window.addEventListener('hashchange', router);