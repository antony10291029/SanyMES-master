﻿layui.config({
    base: "/js/"
}).use(['form', 'element', 'vue', 'layer', 'laydate', 'jquery', 'table', 'hhweb', 'utils', 'Universal'], function () {
    var form = layui.form,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.jquery,
        table = layui.table,
        hhweb = layui.hhweb,
        Universal = layui.Universal;
    
    var AreaName = 'configure';
    var TableName = 'Workshop';
    
    var vm = new Vue({
        el: '#modifyForm'
    });
    
    var vmq = new Vue({
        el: '#panelSearch',
        data: {
        }
    });
    
    hhweb.Config = {
        'CreateTime': vm,
        'UpdateTime': vm,

        'qCreateTime': vmq,
        'qUpdateTime': vmq,
    };
      
    var mainList = {
        Render: function () {
            var cols_arr = [[
                { checkbox: true, fixed: true }
                , {field:'Id', width:80, sort: true, fixed: false, hide: false, title: 'ID' }
                , {field:'Code', width:150, sort: true, fixed: false, hide: false, title: '车间代号' }
                , {field:'Name', width:150, sort: true, fixed: false, hide: false, title: '车间名' }
                , { field: 'FactoryId', width: 150, sort: true, fixed: false, hide: false, title: '工厂', templet: function (d) { return GetLabel('FactoryId', 'Id', 'FactoryCode', d.FactoryId) } }
                , {field:'CreateTime', width:150, sort: true, fixed: false, hide: false, title: '建立时间' }
                , {field:'CreateBy', width:150, sort: true, fixed: false, hide: false, title: '建立者' }
                , {field:'UpdateTime', width:150, sort: true, fixed: false, hide: false, title: '更新时间' }
                , {field:'UpdateBy', width:150, sort: true, fixed: false, hide: false, title: '更新者' }
            ]];

            mainList.Table = table.render({
                elem: '#mainList'
                , url: "/" + AreaName + "/" + TableName + "/Load"
                , method: "post"
                , page: true //开启分页
                , cols: hhweb.ColumnSetting('mainList', cols_arr)
                , id: 'mainList'
                , limit: 20
                , limits: [20, 50, 100, 200, 500, 1000]
                , defaultToolbar: ['filter']
                , toolbar: '#toolbarTable'
                , height: 'full-1'
                , cellMinWidth: 80
                , size: 'sm'
                , done: function (res) { }
            });

            return mainList.Table;
        },
        Load: function () {
            if (mainList.Table == undefined) {
                mainList.Table = this.Render();
                return;
            }
            table.reload('mainList', {});
          //  mainList.Table.reload({
          //      url: "/" + AreaName + "/" + TableName + "/Load"
          //      , method: "post"
         //   });
        }
    };
    
    //编辑
    var EditInfo = function (tabledata) {
        data = tabledata;
        vm.$set('$data', data);
        //表单修改时填充需修改的数据
        var list = {};
        $('.ClearSelector_' + TableName).each(function () {
            var selDom = ($(this));
            if ($(selDom)[0].name.search("q") == -1) {
                list[$(selDom)[0].name] = data[$(selDom)[0].name] + "";
            }
        });
        //表单修改时填充需修改的数据
        form.val('modifyForm', list);
    };

    var selfbtn = {
        //自定义按钮
    };
    
    var selector = {
        'FactoryId': {
            SelType: "FromUrl",
            SelFrom: "/configure/Factory/Load",
            SelModel: "FactoryId",
            SelLabel: "FactoryCode",
            SelValue: "Id",
            Dom: [$("[name='FactoryId']"), $("[name='qFactoryId']")]
        },
    };
    
    var vml = new Array({
        vm: vm,
        vmq: vmq,
    });
    
    Universal.BindSelector(vml, selector);
    Universal.mmain(AreaName, TableName, vm, vmq, EditInfo, selfbtn, mainList);
});