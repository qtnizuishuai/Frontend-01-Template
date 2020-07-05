function find(source, pattern) {
    let starCount = 0;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === "*") {
        starCount++;
      }
    }

    if (starCount === 0) {
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== "?") {
          return false;
        }
      }
      return;
    }

    let i = 0;
    let lastIndex = 0;
    for (i = 0; pattern[i] !== "*"; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") {
        return false;
      }
    }

    lastIndex = i;

    for (let p = 0; p < starCount - 1; p++) {
      i++;
      let subPattern = "";
      while (pattern[i] !== "*") {
        subPattern += pattern[i];
        i++;
      }

      let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
      reg.lastIndex = lastIndex;

      console.log(reg.exec(source));
      lastIndex = reg.lastIndex;
    }

    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
      if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") {
        return false;
      }
    }
    return true;
  }

  function find2() {
    let dp = {};
    let recurCheck = function(s, p) {
        if (!dp[s]) {
            dp[s] = {};
        }
        if(dp[s][p] != null){
            return dp[s][p]
        }

        if (s === p || /^\*+$/.test(p)) {
            dp[s][p] = true;
        } else if(!s || !p) {
            dp[s][p] = false;
        } else if(s[0] === p[0] || p[0] === '?'){
            dp[s][p] = recurCheck(s.slice(1), p.slice(1));
        } else if(p[0] === '*') {
            dp[s][p] = recurCheck(s.slice(1), p) || recurCheck(s, p.slice(1))
        } else{
            dp[s][p] = false;
        }
        return  dp[s][p];
    }
    return recurCheck(s, p);
  }