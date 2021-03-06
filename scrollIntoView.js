function setElementScroll(element, x, y){
    if(element === window){
        element.scrollTo(x, y);
    }else{

        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

function getTargetScrollLocation(target, parent){
    var targetPosition = target.getBoundingClientRect(),
        x,
        y,
        differenceX,
        differenceY;

    if(parent === window){
        x = targetPosition.left + window.scrollX - window.innerWidth / 2 + Math.min(targetPosition.width, window.innerWidth) / 2;
        y = targetPosition.top + window.scrollY - window.innerHeight / 2 + Math.min(targetPosition.height, window.innerHeight) / 2;
        x = Math.max(Math.min(x, document.body.clientWidth - window.innerWidth), 0);
        y = Math.max(Math.min(y, document.body.clientHeight - window.innerHeight), 0);
        differenceX = x - window.scrollX;
        differenceY = y - window.scrollY;
    }else{
        x = Math.min(target.offsetLeft + (targetPosition.width / 2) - parent.clientWidth / 2, target.offsetLeft);
        y = Math.min(target.offsetTop + (targetPosition.height / 2) - parent.clientHeight / 2, target.offsetTop);
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
        differenceX = x - parent.scrollLeft;
        differenceY = y - parent.scrollTop;
    }

    return {
        x: x,
        y: y,
        differenceX: differenceX,
        differenceY: differenceY
    };
}

function transitionScrollTo(target, parent, startTime){
    if(!startTime){
        startTime = +new Date();
    }

    requestAnimationFrame(function(){
        var location = getTargetScrollLocation(target, parent);

        if(new Date() - startTime > 350){
            // Give up and set the scroll position
            setElementScroll(parent,
                location.x,
                location.y
            );
            return;
        }
        setElementScroll(parent,
            location.x - location.differenceX * 0.3,
            location.y - location.differenceY * 0.3
        );

        if(Math.abs(location.differenceY) > 1 || Math.abs(location.differenceX) > 1){
            transitionScrollTo(target, parent, startTime);
        }
    });
}

module.exports = function(target){
    if(!target){
        return;
    }

    var parent = target.parentNode,
        targetPosition = target.getBoundingClientRect(),
        parentOverflow;

    while(parent && parent.tagName !== 'BODY'){
        parentOverflow = window.getComputedStyle(parent).overflow;
        if(
            parentOverflow === 'auto' ||
            parentOverflow === 'scroll' ||
            parentOverflow === 'scrollX' ||
            parentOverflow === 'scrollY'
        ){
            transitionScrollTo(target, parent);
        }

        parent = parent.parentNode;
    }

    transitionScrollTo(target, window);
};