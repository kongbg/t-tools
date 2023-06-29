console.log("This is injected into")

run();

// 主函数
function run() {
    const hostname = getSubdomains(window.location.href);
    const info = getConfig(hostname);
    if (info) {
        const configs = info.configs;
        configs.forEach(config => {
            doAction(config);
        });
    }
}

// 通过hostname获取网站处理配置
// TODO: 做成可配置，可共享到公网
function getConfig(hostname) {
    let config = [
        {
            hostname: 'juejin.cn',
            configs: [
                {
                    action: 'redirect',
                    from: 'url',
                    paramName: 'target'
                }
            ]
        },
        {
            hostname: 'zhihu.com',
            configs: [
                {
                    action: 'clickDom',
                    domKey: '.Modal-closeButton'
                }
            ]
        }
    ]
    return config.find(item=> item.hostname === hostname);
}

// 操作
function doAction (config) {
    const action = config.action;

    // 重定向操作
    if (action === 'redirect') {
        let redirectUrl = '';
        if (config.from === 'url') {
            const params = getParmas( window.location.search);
            redirectUrl = params.get(config.paramName);
        }
        // console.log(redirectUrl);
        window.location.href = redirectUrl;
    }

    // 点击页面上的一个元素
    if (action === 'clickDom') {
        let timer = null;
        let num = 0;
        let max = 100;
        let temp = 0;
        clickDom(config.domKey);
        function clickDom (domKey){
            num++;
            const dom = document.querySelector(config.domKey);
            if (dom) {
                // console.log('获取到dom了')
                clearTimeout(timer);
                dom.click();
            } else if (!dom && num <= max) {
                // 70次以后 是2.1s后，2.1s后延时增加到1s
                if (num > 70 && num <= 100) {
                    temp = 970
                }
                timer = setTimeout(()=>{
                    // console.log('没获取到dom，继续', num, timer)
                    clickDom(domKey);
                }, 30+temp);
            }
        }
    }

    // 隐藏一个元素
    if (action === 'hideDom') {

    }
}

// 获取url参数
function getParmas(search) {
    return new URLSearchParams(search);
};

// 获取二级域名
function getSubdomains(currentUrl) {
    const url = new URL(currentUrl);
    const hostnameParts = url.hostname.split('.');
    return hostnameParts.slice(-2).join('.');;
}



