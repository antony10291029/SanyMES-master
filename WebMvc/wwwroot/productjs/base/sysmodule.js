layui.config({
    base: "/js/"
}).use(['form', 'vue', 'ztree', 'layer', 'jquery', 'table', 'droptree', 'hhweb', 'utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;

    var table = layui.table;
    var hhweb = layui.hhweb;
    layui.droptree("/base/UserSession/GetModules", "#ParentName", "#ParentId", false);

    $("#menus").loadMenus("SysModule", 1);
    $("#menus2").loadMenus("SysModule", 2);

    //主列表加载，可反复调用进行刷新
    var config = {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/base/UserSession/GetModulesTable'
            , method: 'POST'
            , where: config,
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }

    //菜单列表
    var menucon = {};  //table的参数，如搜索key，点击tree的id
    var menuList = function (options) {
        if (options != undefined) {
            $.extend(menucon, options);
        }
        table.reload('menuList', {
            url: '/base/SysModule/LoadMenus'
            , method: 'POST'
            , where: menucon,
            //page: {
            //    //curr: 1 //重新从第 1 页开始
            //}
        });
    }

    //左边树状机构列表
    var ztree = function () {
        var url = '/base/UserSession/GetModules';
        var zTreeObj;
        var setting = {
            view: { selectedMulti: false },
            data: {
                key: {
                    name: 'Name',
                    title: 'Name'
                },
                simpleData: {
                    enable: true,
                    idKey: 'Id',
                    pIdKey: 'ParentId',
                    rootPId: 'null'
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    mainList({ pId: treeNode.Id });
                }
            }
        };
        var load = function () {
            $.getJSON(url, function (json) {
                zTreeObj = $.fn.zTree.init($("#tree"), setting);
                var newNode = { Name: "根节点", Id: null, ParentId: "" };
                json.push(newNode);
                zTreeObj.addNodes(null, json);
                mainList({ pId: "" });
                zTreeObj.expandAll(true);
            });
        };
        load();
        return {
            reload: load
        }
    }();
    $("#tree").height($("div.layui-table-view").height());
    //添加（编辑）模块对话框
    var editDlg = function () {
        var vm = new Vue({
            el: "#formEdit"
        });

        var update = false;  //是否为更新
        var show = function (data) {
            var title = update ? "编辑信息" : "添加";
            index = layer.open({
                title: title,
                area: ["500px", "400px"],
                type: 1,
                content: $('#divEdit'),
                success: function () {
                    vm.$set('$data', data);

                    $(":radio[name='IsShow'][value='" + data.IsShow + "']").prop("checked", "checked");
                    form.render();
                }
            });
            var url = "/base/SysModule/Add";
            if (update) {
                url = "/base/SysModule/Update";
            }
            //提交数据
            form.on('submit(formSubmit)',
                function (data) {
                    $.post(url,
                        data.field,
                        function (data) {
                            layer.msg(data.Message);
                            if ((!update) && data.Code == 200) {  //添加成功要刷新左边的树
                                ztree.reload();
                            }
                            mainList();
                            layer.close(index);
                        },
                        "json");
                    return false;
                });
        }
        return {
            add: function () { //弹出添加
                update = false;
                show({
                    Id: "",
                    SortNo: 1,
                    IconName: '&#xe678;',
                    IsShow: 1,
                });
            },
            update: function (data) { //弹出编辑框
                update = true;
                show(data);
            }
        };
    }();

    //添加菜单对话框
    var meditDlg = function () {
        var vm = new Vue({
            el: "#mfromEdit"
        });

        var update = false;  //是否为更新
        var show = function (data) {
            var title = update ? "编辑菜单" : "添加菜单";
            index = layer.open({
                title: title,
                area: ["500px", "400px"],
                type: 1,
                content: $('#divMenuEdit'),
                success: function () {
                    vm.$set('$data', data);
                }
            });
            var moduleId = data.ModuleId
            var url = "/base/SysModule/AddMenu";
            if (update) {
                url = "/base/SysModule/UpdateMenu";
            }
            //提交数据
            form.on('submit(mformSubmit)',
                function (data) {
                    $.post(url,
                        data.field,
                        function (data) {
                            layer.msg(data.Message);
                            layer.close(index);
                            menuList({ moduleId: moduleId });
                        },
                        "json");
                    return false;
                });
        }
        return {
            add: function (moduleId) { //弹出添加
                update = false;
                show({
                    Id: "",
                    ModuleId: moduleId,
                    Sort: 1,
                    AreaMenus: 1
                });
            },
            update: function (data) { //弹出编辑框
                update = true;
                show(data);
            }
        };
    }();

    //监听模块表格内部按钮
    table.on('tool(list)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {      //查看
            menuList({ moduleId: data.Id });
        }
    });

    //监听页面主按钮操作
    var active = {
        btnDel: function () {      //删除模块
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;

            hhweb.del("/base/SysModule/Delete",
                data.map(function (e) { return e.Id; }),
                function () {
                    mainList();
                    ztree.reload();
                });
        }
        , btnDelMenu: function () {      //删除菜单
            var checkStatus = table.checkStatus('menuList')
                , data = checkStatus.data;
            hhweb.del("/base/SysModule/DelMenu",
                data.map(function (e) { return e.Id; }),
                menuList);
        }
        , btnAdd: function () {  //添加模块
            editDlg.add();
        }
        , btnAddMenu: function () {  //添加菜单
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择一个要添加菜单的模块");
                return;
            }
            meditDlg.add(data[0].Id);
        }
        , btnEdit: function () {  //编辑
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.alert("请选择编辑的行，且同时只能编辑一行", { icon: 5, shadeClose: true, title: "错误信息" });
                return;
            }
            editDlg.update(data[0]);
        }

        , btnEditMenu: function () {  //编辑菜单
            var checkStatus = table.checkStatus('menuList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择编辑的菜单");
                return;
            }
            meditDlg.update(data[0]);
        }

        , search: function () {   //搜索
            mainList({ key: $('#key').val() });
        }
        , btnRefresh: function () {
            mainList();
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    var IconNameindex;
    var IconInputObj;
    $('.IconName').on('click', function () {
        IconInputObj = this;
        IconNameindex = layer.open({
            maxmin: true,
            title: "图标选择",
            area: ["500px", "400px"],
            type: 1,
            content: $('#divIconNameEdit'),
            success: function (layero, index) {
                layer.full(index);
            }
        });
    });

    $('#mfromIconNameEdit .iconfont-list .icon').on('click', function () {
        var type = $(this).next().next().html();
        $(IconInputObj).val("&" + type.replace("&amp;", ""));
        layer.close(IconNameindex);
    });

    var Classindex;
    var ClassInputObj;
    $('.Class').on('click', function () {
        ClassInputObj = this;
        Classindex = layer.open({
            maxmin: true,
            title: "样式选择",
            area: ["500px", "400px"],
            type: 1,
            content: $('#divClassEdit'),
            success: function (layero, index) {
                layer.full(index);
            }
        });
    });

    $('#mfromClassEdit .iconfont-list .layui-btn').on('click', function () {
        var type = $(this).next().html();
        $(ClassInputObj).val(type);
        layer.close(Classindex);
    });
    //监听页面主按钮操作 end
})