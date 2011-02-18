//Written by Debugged Interactive Designs
//www.debuggeddesigns.com
Cc8b = {
	changeLink : function (cipher)
	{
		var key = cipher.substr(0,cipher.indexOf('.'));
		var link = cipher.substr(cipher.indexOf('.')+1);
		var email = link.substr(0,link.indexOf('.'));
		var text = link.substr(link.indexOf('.')+1);
	
		var decoded_text = Cc8b.decipher(text,key);
		var decoded_link = Cc8b.decipher(email,key);
		return decoded_text.link("mailto:"+ decoded_link);
	},
	
	decipher : function (cipherText,key)
	{
	
		var plainText = new String("");
		var temp;
	
		key = parseInt(key,10);
	
		for(var i=0;i <= cipherText.length - 2;i=i+2)
		{
			temp = cipherText.substr(i,2);
			temp = parseInt(temp,16);
			temp += 0xFF; 
			temp -= key;
			temp = temp % 0xFF;
			plainText += String.fromCharCode(temp);
		}
		return plainText;
	},

	write : function (cipher)
	{
		document.write(Cc8b.changeLink(cipher));
	}
}