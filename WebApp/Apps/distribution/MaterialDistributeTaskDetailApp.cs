﻿using Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using WebRepository;

namespace WebApp
{
    /// <summary>
	/// 物料配送任务表
	/// </summary>
    
    public partial class MaterialDistributeTaskDetailApp
    {
        private IUnitWork _unitWork;
        public IRepository<MaterialDistributeTaskDetail> _app;
        private static IHostingEnvironment _hostingEnvironment;
        ExcelHelper imp = new ExcelHelper(_hostingEnvironment);

        public MaterialDistributeTaskDetailApp(IUnitWork unitWork, IRepository<MaterialDistributeTaskDetail> repository, IHostingEnvironment hostingEnvironment)
        {
            _unitWork = unitWork;
            _app = repository;
            _hostingEnvironment = hostingEnvironment;
        }
        
        public MaterialDistributeTaskDetailApp SetLoginInfo(LoginInfo loginInfo)
        {
            _app._loginInfo = loginInfo;
            return this;
        }
        
        public TableData Load(PageReq pageRequest, MaterialDistributeTaskDetail entity)
        {
            return _app.Load(pageRequest, entity);
        }

        public void Ins(MaterialDistributeTaskDetail entity)
        {
            _app.Add(entity);
        }

        public void Upd(MaterialDistributeTaskDetail entity)
        {
            _app.Update(entity);
        }

        public void DelByIds(int[] ids)
        {
            _app.Delete(u => ids.Contains(u.Id.Value));
        }
        
        public MaterialDistributeTaskDetail FindSingle(Expression<Func<MaterialDistributeTaskDetail, bool>> exp)
        {
            return _app.FindSingle(exp);
        }

        public IQueryable<MaterialDistributeTaskDetail> Find(Expression<Func<MaterialDistributeTaskDetail, bool>> exp)
        {
            return _app.Find(exp);
        }

        public Response ImportIn(IFormFile excelfile)
        {
            Response result = new Infrastructure.Response();
            List<MaterialDistributeTaskDetail> exp = imp.ConvertToModel<MaterialDistributeTaskDetail>(excelfile);
            string sErrorMsg = "";

            for (int i = 0; i < exp.Count; i++)
            {
                try
                {
                    MaterialDistributeTaskDetail e = exp[i];
                    e.Id = null;
                    _app.Add(e);
                }
                catch (Exception ex)
                {
                    sErrorMsg += "第" + (i + 2) + "行:" + ex.Message + "<br>";
                    result.Message = sErrorMsg;
                    break;
                }
            }
            if (sErrorMsg.Equals(string.Empty))
            {
                if (exp.Count == 0)
                {
                    sErrorMsg += "没有发现有效数据, 请确定模板是否正确， 或是否有填充数据！";
                    result.Message = sErrorMsg;
                }
                else
                {
                    result.Message = "导入完成";
                }
            }
            else
            {
                result.Status = false;
                result.Message = result.Message;
            }
            return result;
        }

        public TableData ExportData(MaterialDistributeTaskDetail entity)
        {
            return _app.ExportData(entity);
        }

        public TableData Query(MaterialDistributeTaskDetail entity)
        {
            var result = new TableData();
            var data = _app.Find(EntityToExpression<MaterialDistributeTaskDetail>.GetExpressions(entity));

            GetData(data, result);
            result.count = data.Count();

            return result;
        }

        public void GetData(IQueryable<MaterialDistributeTaskDetail> data, TableData result, PageReq pageRequest = null)
        {
            _app.GetData(data, result, pageRequest);
        }
    }
}

