﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GWebsite.AbpZeroTemplate.Application.Share.ProductType.Dto
{
    public class ProductTypeListInputDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public int Status { get; set; }

        public int PageSize { get; set; }
        public int CountSkip { get; set; }
    }
}
