﻿namespace WebRepository
{
    /// <summary>
    /// 用户ID
    /// </summary>
    public class SysModuleElementView: SysEntity
    {
        /// <summary>
        /// DOM ID
        /// </summary>
        /// <returns></returns>
        public string DomId { get; set; }

        /// <summary>
        /// 组织名称
        /// </summary>
        /// <returns></returns>
        public string Name { get; set; }

        //模块ID
        public int ModuleId { get; set; }

        /// <summary>
        /// 所属模块名称
        /// </summary>
        public string ModuleName { get; set; }

        /// <summary>
        /// 授权状态
        /// </summary>
        public bool Accessed { get; set; }

        public SysModuleElementView()
        {
            this.Id = 0;
            this.DomId = string.Empty;
            this.Name = string.Empty;
            this.ModuleId = 0;
            this.ModuleName = string.Empty;
            this.Accessed = false;
        }
    }
}