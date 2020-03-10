class JX3_URL {
    getUrlParam(name) {
        let url_params = {};
        let vars = window.location.search.substring(1).split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair.length !== 2) continue;
            url_params[pair[0]] = pair[1];
            if (name && url_params[name]) return decodeURIComponent(url_params[name]);
        }
        if (name) return false;
        return url_params;
    }

    hasUrlParam() {
        return JSON.stringify(this.getUrlParam()) !== "{}";
    }

    getHashParam(name) {
        let hash_params = {};
        let vars = window.location.hash.substring(1).split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair.length !== 2) continue;
            hash_params[pair[0]] = pair[1];
            if (name && hash_params[name]) return decodeURIComponent(hash_params[name]);
        }
        if (name) return false;
        return hash_params;
    }

    hasHashParam() {
        return JSON.stringify(this.getHashParam()) !== "{}";
    }
}

export default JX3_URL;