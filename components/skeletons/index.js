// component/skeletons/index.js.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        selector: {
            type: String,
            value: 'skeletons'
        },
        background: {
            type: String,
            value: '#FFF'
        },
        loading: {
            type: String,
            value: ''
        },
        block_animation: {
            type: String,
            value: 'shine'
        },
        is_capture_nodes: {
            type: Boolean,
            default: false,
            observer(newVal, oldVal, changedPath) {
                if (newVal) {
                    setTimeout(() => {
                        this.rect_list = this.getSelector(`.${this.selector}-rect`);
                        this.circle_list = this.getSelector(`.${this.selector}-circle`);

                        // 捕获节点后关闭加载动效
                        console.log('关闭loading');
                        this.setData({
                            is_loading: false
                        }, () => {

                            ['rect_list', 'circle_list'].forEach((name) => {
                                this.drawGraph(name, this[name]);
                            })
                            console.log('抓取节点渲染');
                        })
                    }, .25e3)
                }
            }
        },
        is_complete: {
            type: Boolean,
            default: false,
            observer(newVal, oldVal, changedPath) {
                if (newVal) {
                    setTimeout(() => {
                        console.log('隐藏关闭组件');
                        this.setData({
                            show: false
                        }, () => {
                            setTimeout(() => {
                                this.setData({
                                    hide: false
                                })
                            }, .25e3)
                        })
                    }, .75e3)
                }
            }
        }
    },
    data: {
        show: true, //组件展示
        hide: true, //组件隐藏
        rect_list: [],
        circle_list: [],
        is_loading: true,
        system_info_sync: {
            height: 0,
            width: 0,
            top: 0,
            left: 0
        }
    },
    attached() {
        const system_info_sync = wx.getSystemInfoSync();

        this.setData({
            'system_info_sync.width': system_info_sync.windowWidth,
            'system_info_sync.height': system_info_sync.windowHeight
        })

        this.selector = this.data.selector;
    },
    ready() {
        const selector_container = this.getSelector(`.${this.selector}`);
        
        selector_container.boundingClientRect().exec((res) => {
            if (res[0][0]) {
                const {
                    top,
                    left
                } = res[0][0];

                const system_info_sync = Object.assign(this.data.system_info_sync, { top, left })

                this.setData({
                    system_info_sync
                });
            }
        });
    },
    methods: {
        getSelector: (name) => wx.createSelectorQuery().selectAll(name),
        drawGraph(name, selector) {
            const screen_height = this.data.system_info_sync.height;

            selector.boundingClientRect().exec((res) => {
                this.setData({
                    [name]: res[0].filter(x => x.top <= screen_height)
                })
            })
        }
    }
})