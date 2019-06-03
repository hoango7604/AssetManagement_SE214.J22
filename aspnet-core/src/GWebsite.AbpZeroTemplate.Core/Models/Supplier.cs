﻿using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace GWebsite.AbpZeroTemplate.Core.Models
{
    public partial class Supplier : Entity<int>
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Phone { get; set; }
        public string Contact { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public DateTime CreateDate { get; set; }
        public int Status { get; set; }
        public SupplierType SupplierType { get; set; }
        public int SupplierTypeId { get; set; }
        public ICollection<Product> Products { get; set; }
        public Supplier()
        {
            Products = new Collection<Product>();
        }
    }
}

