﻿using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GWebsite.AbpZeroTemplate.Core.Models
{
    public partial class Product : Entity<int>
    {
        public string Name { get; set; }
        public float Price { get; set; }
        public string Code { get; set; }
        public string Address { get; set; }
        public string UnitPrice { get; set; }
        public string CalUnit { get; set; }
        public DateTime CreateDate { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
        //public Image Image { get; set; }
        public Supplier Supplier { get; set; }
        public int? SupplierId { get; set; }
        public ProductType ProductType { get; set; }
        public int? ProductTypeId { get; set; }
        //public ICollection<PurchaseProduct> PurchaseProducts { get; set; }
        public ICollection<Bidding> Biddings { get; set; }
        public Product()
        {
            CreateDate = DateTime.Now;
            //PurchaseProducts = new Collection<PurchaseProduct>();
            Biddings = new Collection<Bidding>();
        }
    }
}
