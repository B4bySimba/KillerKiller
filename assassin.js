

var Config = {

  'fps': 60,
  
  'assassin_per_second': 1,
  
  'width': function() { return document.getElementById("canvas").width; },
  
  'height': function() { return document.getElementById("canvas").height; },
  
  'text_field_height': function() { return (document.getElementById("canvas").height/8); },
  
  'playingfield_height': function() { return (Config.height() - Config.text_field_height()); }
  
}


var Wordlist = [
  "Mary",
  "had",
  "little",
  "lamb",
  "whose",
  "fleece",
  "was",
  "white",
  "as",
  "snow",
  "everywhere",
  "that",
  "went",
  "and",
  "the",
  "sure",
  "to",
  "go"
]

var Key = {
  'Backspace': 8,
  'Enter': 13
}



var Textfield = {
  
  'init': function(ctx) {
  
    self.ctx = ctx;
    self.text = '';
  
    document.onkeydown = Textfield.key_up;   
  
  }, //init()
  
  'draw': function() {

    ctx.fillStyle = "rgb(9,21,45)";
    ctx.fillRect (0, Config.playingfield_height(), Config.width(), Config.height());

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "24px 'Arial'";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text+'_', Config.width()/2, Config.playingfield_height() + Config.text_field_height()/2 );
    
  }, //draw()

  'key_up': function(event) {
  
    switch(event.keyCode) {
    
      case Key.Enter:
        KillerKiller.check_word(text);
        text = '';
        event.cancelBubble = true;
        event.returnValue = false;
        break;
        
      case Key.Backspace:
        text = text.slice(0,-1);
        event.cancelBubble = true;
        event.returnValue = false;
        break;
        
      default:
        text += String.fromCharCode(event.keyCode);
        
    }//switch
  
    return false;
  
  }//key_up()


}//Textfield



var PlayingField = {

  'init': function(ctx){
  
    self.ctx = ctx;
    self.assassins = [];
    
    self.assassin_image = new Image(); 
    self.assassin_image.src="assassin.png";
    
  },//init()
  
  
  'draw': function() {

    PlayingField.draw_background();
    
    
    if (self.assassins.length >= 10) {
      KillerKiller.running = false;
    }
    
    //draw the assassins
    for(i=0; i < self.assassins.length; i++)
      PlayingField.draw_assassin( self.assassins[i] );
    
    
  },//draw()
  
  'draw_background': function() {
  
    var objGradient = ctx.createRadialGradient(Config.width()/2, (Config.height()-Config.text_field_height()), 50, Config.width()/2, Config.playingfield_height(), Config.width()/2);
    objGradient.addColorStop(0, '#1C2F5C');
    objGradient.addColorStop(1, '#09152D');
    ctx.fillStyle = objGradient;
    ctx.fillRect(0, 0, Config.width(), (Config.height()-Config.text_field_height()));
    
  },//draw_background()
  
  'draw_assassin': function(assassin) {

      //draw the assassin image      
      ctx.drawImage(assassin_image,assassin.x, assassin.y); 

      //draw the assassin's text
      ctx.font = "18px 'Arial'";
      ctx.textAlign = 'center';
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillText(assassin.caption, 1 + assassin.x + assassin_image.width/2, 1 + assassin.y + assassin_image.height);
      
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(assassin.caption, assassin.x + assassin_image.width/2, assassin.y + assassin_image.height);
  
  },//draw_assassin()


  'draw_fin': function() {
  
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, Config.width(), Config.height());


    if (Scores.score > 2)
      var fin_text = 'You got ' + Scores.score + ' assassins.';
    else if (Scores.score == 1)
      var fin_text = 'You got 1 assassin.';
    else
      var fin_text = 'You got no assassins. Try again!';

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "24px 'Arial'";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillText(fin_text, Config.width()/2, Config.height()/2 );
  
  },//draw_fin()


  'add_assassin': function(caption) {
    
    assassins.push({
      'caption': caption.toUpperCase(),
      'x': Math.random()* (Config.width() - assassin_image.width),
      'y': Math.random()* (Config.playingfield_height() - assassin_image.height)
    });
    
  },//add_assassin()
  
  'remove_assassin': function(caption) {
  
    for(i=0; i < assassins.length; i++)
      if (assassins[i].caption == caption) {
        assassins.splice(i,1);
        Scores.add();
      }
  
  }//remove_assassin()

}//PlayingField


var Scores = {

  'init': function(ctx) {
    
    self.ctx = ctx;
    Scores.score = 0;    
  
  },//init()
   
  'draw': function() {
  
    if (Scores.score > 0) {

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = "18px 'Arial'";
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      ctx.fillText(Scores.score + " assassins", Config.width()-30, 25 );

    }//if
  
  },//draw()
  
  'add': function() {
    Scores.score++;
  }

}





var KillerKiller = {

  'init': function() {
  
      self.canvas = document.getElementById("canvas");
      KillerKiller.ctx = canvas.getContext("2d");
      
      KillerKiller.running = true;
      
      //maximize in window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      Textfield.init(KillerKiller.ctx);
      PlayingField.init(KillerKiller.ctx);
      Scores.init(KillerKiller.ctx);
      
      setInterval( KillerKiller.draw, 1000/Config.fps );
      setInterval( KillerKiller.add_assassin, 1000/Config.assassin_per_second );
      
  },//init()
  
  
  'check_word': function(word) {

    PlayingField.remove_assassin(word);
  
  },//check_word()
  
  
  'draw': function() {
      
      //clear canvas
      KillerKiller.ctx.clearRect(0,0,canvas.width,canvas.height); 

      if (!KillerKiller.running) {
      
        PlayingField.draw_fin();
      
      } else {

        Textfield.draw();
        PlayingField.draw();
        Scores.draw();
      }
      
    },//draw()
    
    'add_assassin': function() {
    
      var index = Math.floor( Math.random() * Wordlist.length );
      PlayingField.add_assassin( Wordlist[index] );
    
    }//add_assassin()


}//KillerKiller