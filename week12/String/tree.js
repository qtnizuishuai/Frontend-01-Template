class Trie {
    constructor() {
      this.root = Object.create(null);
    }

    insert(word) {
      let node = this.root;
      for (const w of word) {
        if (!node[w]) {
          node[w] = Object.create(null);
        }
        node = node[w];
      }

      if (!("$" in node)) {
        node["$"] = 0;
      }
      node["$"]++;
    }

    most() {
      let max = 0;
      let maxWord = null;
      let visit = (node, word) => {
        if (node.$ && node.$ > max) {
          max = node.$;
          maxWord = word;
        }
        for (const n in node) {
          visit(node[n], word + n);
        }
      }
      visit(this.root, "");
      console.log(maxWord);
    }
  }
  function randomWord(length) {
    var s = "";
    for (let i = 0; i < length; i++) {
      s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0))
    }
    return s;
  }

  let trie = new Trie();

  for (let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4));
  }