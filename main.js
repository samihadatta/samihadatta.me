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


