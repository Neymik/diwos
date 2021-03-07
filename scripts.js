
(function(exports){

  exports.getCookies = function(name){
    let i = 0
    let cookies = document.cookie.split('; ')
    let cookieName = name + '='
    while (i < cookies.length) {
        if (cookies[i].startsWith(cookieName)) {
            let valueCookies = cookies[i].split('=')
            return valueCookies[1]
            break
        }
        i++
    }
  };



}(typeof exports === 'undefined' ? this.scripts = {} : exports));
