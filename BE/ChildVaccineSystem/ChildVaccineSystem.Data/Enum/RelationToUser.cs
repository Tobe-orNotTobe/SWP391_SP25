using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Enum
{
    public enum RelationToUser
    {
        Son,       // Con trai 0
        Daughter,  // Con gái  1
        Grandchild, // Cháu    2
        YoungerBrother, // Em trai  3
        YoungerSister,  // Em gái    4
        Relative, // họ hàng 5
        Other //khác 6
    }

}
