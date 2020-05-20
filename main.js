// const ADJUSTMENT_CLASSES = ["selected", "unselected"];

const NAV_ID = "navbar";
const CONTENT_ID = "content";
const FOOTER_ID = "footer";
let PATH_TO_ID = {};

function containsClass(element, className) {
    let classes = element.getAttribute("class");
    classes = classes.split(" ");
    for (let currentClass of classes) {
        if (currentClass === className) {
            return true;
        }
    }
    return false;
}

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
  return templates[section.id] = () => { templateFunction(section) };
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
    console.log('routes');
    console.log(routes);
    console.log("spot");
    console.log(routes[path]);
    window.scrollTo(0,0);
    try {
     return routes[path]();
    } catch (error) {
        // throw new Error("The route is not defined");
        return routes["/"];
    }
};
// The actual router, get the current URL and generate the corresponding template
let router = (evt) => {
    console.log('in router');
    const url = window.location.hash.slice(1) || "/";
    document.getElementById(CONTENT_ID).innerHTML = "";
    resolveRoute(url);
    console.log('route: ' + url);
};

let loadPage = (evt) => {
    fetch('data.json')
    .then((response) => {
            const data = response.json().then((data) => {
            
            // load nav bar
            let navbar = document.getElementById(NAV_ID);
            navbar.innerHTML = "";
            let navHeaderContainer = document.createElement("div");
            navHeaderContainer.id = "nav-header-container";
            const hamburger = document.createElement('label');
            hamburger.id = "hamburger";
            hamburger.setAttribute("for", "toggle");
            const icon = document.createElement("i");
            icon.setAttribute("class", "fas fa-bars");
            hamburger.append(icon);
            navHeaderContainer.append(hamburger);
            const headerElement = document.createElement('div');
            headerElement.id = "nav-header";
            const headerLink = createLink(data.title, data.title, '/');
            headerElement.append(headerLink);
            navHeaderContainer.append(headerElement);
            navbar.append(navHeaderContainer);
            console.log(navbar);
            
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "toggle";
            navbar.append(checkbox);

            const navItems = document.createElement('div');
            navItems.id = "nav-items";
            for (let navItem of data.nav) {
                const link = createLink(navItem.title, navItem.title, "/#"+navItem.link);
                link.setAttribute('class', 'nav-item');
                link.id = navItem.section + "-tab";
                link.onclick = () => {
                    document.getElementById("toggle").checked = false;
                }
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
                    console.log(section);
                    let linksAdded = false;
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
                    if ("links" in section && "links" in section.style && section.style.links === "links-in-textdiv") {
                        linksAdded = true;
                        const linksDiv = document.createElement("div");
                        linksDiv.id = "topLinks";
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
                        textDiv.append(linksDiv);
                    }
                    if ("image" in section) {
                        const image = document.createElement("img");
                        image.id = "main-image";
                        image.src = section.image;
                
                        if (section === "image-first") {
                            topDiv.append(image);
                            topDiv.append(textDiv);
                        } else { // if "toparrange" === "image-second"
                            topDiv.append(textDiv);
                            topDiv.append(image);
                        }
                        contentDiv.append(topDiv);
                    } else {
                        textDiv.style.width = "100%";
                        topDiv.append(textDiv);
                        contentDiv.append(topDiv);
                    }
                
                    // now the rest of the page items: links, items, or text
                    if ("items" in section) {
                        const itemsDiv = document.createElement("div");
                        itemsDiv.setAttribute("class", "items");
                        let itemNumber = 0;
                        for (let item of section.items) {
                            const itemDiv = document.createElement("div");
                            itemDiv.setAttribute("class", section.style.item + " item");
                            if (itemNumber % 2 !== 0) {
                                itemDiv.style.flexDirection = "row-reverse";
                            }
                            const title = document.createElement("h2");
                            title.setAttribute("class", section.id + "-header");
                            title.innerText = item.title;
                            // itemDiv.append(title);
                
                            const info = document.createElement("div");
                            info.setAttribute("class", section.id + " textinfo");
                            info.append(title);
                            // const textinfo = document.createElement("div");
                            // textinfo.setAttribute("class", "textinfo");
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
                            // info.append(textinfo);
                            itemDiv.append(info);
                            const image = document.createElement("img");
                            image.id = "item-img";
                            image.src = item.image;
                            itemDiv.append(image);

                            // itemDiv.append(info);
                
                            itemsDiv.append(itemDiv);
                            itemNumber += 1;
                        }
                        contentDiv.append(itemsDiv);
                    }
                
                    if ("links" in section) {
                        console.log('we have some links!');
                        const linksDiv = document.createElement("div");
                        if (linksAdded) {
                            linksDiv.id = "lowerLinks";
                        }
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

                    if ("text" in section) {
                        const textSectionDiv = document.createElement("div");
                        textSectionDiv.setAttribute("class", "text");
                        let text = section.text;
                        text = text.split("\n");
                        for (let paragraph of text) {
                            let paragraphElement = document.createElement("p");
                            paragraphElement.innerText = paragraph;
                            paragraphElement.setAttribute("class", "text-paragraph");
                            textSectionDiv.append(paragraphElement);
                        }
                        contentDiv.append(textSectionDiv);
                    }

                    if ("file" in section) {
                        const fileSectionDiv = document.createElement("div");
                        fileSectionDiv.setAttribute("class", "file");
                        const file = document.createElement("iframe");
                        file.src = section.file;
                        file.width = "95%";
                        file.height="95%";
                        file.alt = "This browser does not support PDFs :( Please email me for a link to view it!";
                        fileSectionDiv.append(file);
                        contentDiv.append(fileSectionDiv);
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