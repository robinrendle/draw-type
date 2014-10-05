var drawType = (function(){
    var canvas, ctx, flag = false,
        drawtype = {},
        prevX = 0,
        h,
        w,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false,
        saveButton = document.querySelector('.save-button'),
        eraseButton = document.querySelector('.erase-button'),
        cache = [],
        canvas = document.querySelector('canvas'),
        selectCase = document.querySelector('.select-case'),
        lowercase = true,
        uppercase = false,
        drawn = false,
        letterbox = document.getElementById('letterbox');

    var x = "black",
        y = 4;

    drawtype.init = function(){
        ctx = canvas.getContext('2d');
        w = canvas.width;
        h = canvas.height;
        this.drawLetters();
        this.createTypeface();
        this.bind();
    };
    drawtype.drawLetters = function(){
        var alphabet ="abcdefghijklmnopqrstuvwxyz".split("");

        alphabet.forEach(function(letter){
            var container = document.createElement('div');
            container.classList.add('card');
            container.innerText = letter;
            letterbox.appendChild(container);
        });
        drawtype.fillData();
    };
    drawtype.fillData = function(){
        var letters = letterbox.querySelectorAll('.card');

        for(var i = 0; i < letters.length; i++){
            key = letters[i].textContent;

            cache[key] = {
                data: "",
                lowercase: "",
                uppercase: ""
            };
            
            letters[i].addEventListener('click', function(){

                if(drawn){
                    drawtype.save();
                    drawtype.erase();
                }

                var dataLetter = this.textContent;
                canvas.setAttribute('data-name', dataLetter);

                for (var i = 0; i < letters.length; i++){
                    letters[i].classList.remove('current');
                };

                this.classList.toggle('current');

                if (cache[dataLetter].uppercase || cache[dataLetter].lowercase){
                    var img = new Image;

                    if (cache[dataLetter].uppercase){
                        img.src = cache[dataLetter].uppercase;
                    } else {
                        img.src = cache[dataLetter].lowercase;
                    }

                    ctx.drawImage(img, 0,0);
                }

            }, false);
        };

        return cache;
    };
    drawtype.bind = function(){
        selectCase.addEventListener('change', function(e) {
            if(drawn){
                drawtype.save();
                drawtype.erase();
            }
            if(this.value === "uppercase"){
                uppercase = true;
                letterbox.classList.add('uppercase');
            } else {
                letterbox.classList.remove('uppercase');
            }
        }, false);
        canvas.addEventListener('mousemove', function(e){
            drawtype.findxy('move', e);
        }, false);
        canvas.addEventListener('mousedown', function(e){
            drawtype.findxy('down', e);
        }, false);
        canvas.addEventListener('mouseup', function(e){
            drawn = true;
            drawtype.findxy('up', e);
        }, false);
        canvas.addEventListener('mouseout', function(e){
            drawtype.findxy('out', e);
        }, false);
        saveButton.addEventListener('click', function(e){
            e.preventDefault();
            drawtype.save();
        }, false);
        eraseButton.addEventListener('click', function(e){
            e.preventDefault();
            drawtype.erase();
        }, false);
    };
    drawtype.draw = function(){
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    };
    drawtype.erase = function(){
        ctx.clearRect(0,0,w,h);
        drawn = false;
    };
    drawtype.save = function(){
        if (drawn){
            var dataURL = canvas.toDataURL();
            var name = canvas.getAttribute('data-name');

            if (uppercase){
                cache[name].uppercase = dataURL;
            } else {
                cache[name].lowercase = dataURL;
            }
        } else {
            alert('YO');
        }
    };
    drawtype.findxy = function(res, e) {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;

            flag = true;
            dot_flag = true;

            if(dot_flag){
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == 'out'){
            flag = false;
        }
        if (res == 'move' && flag){
            prevX = currX; 
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            drawtype.draw();
        }
    };
    drawtype.createTypeface = function(){
        var textField = document.querySelector('.text-field');
        var textResult = document.querySelector('.text-result');

        textField.addEventListener('input', function(e){
            var items = this.value.split("");
            var lastItem = items.length - 1;
            var typedLetter = items[lastItem];

            if (typedLetter == typedLetter.toUpperCase()) {
                typedLetter = typedLetter.toLowerCase();
                var dataImage = cache[typedLetter].uppercase;
            } else {
                var dataImage = cache[typedLetter].lowercase;
            }

            if (dataImage) {
                var img = document.createElement('img');
                img.src = dataImage;
                img.className = 'small-image';
                textResult.appendChild(img);
            } else {
                console.log("There is no data, bro!");
            }
        }, false);
    };


    return drawtype;

})();


document.addEventListener('DOMContentLoaded', function(){
    drawType.init();
}, false);
