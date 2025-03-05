using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Data.Enum
{
    public enum RelationToUser
    {
        SonOrDaughter,     // Con (bao gồm Con trai, Con gái)
        Grandchild,        // Cháu
        Sibling,           // Anh chị em (bao gồm Em trai, Em gái)
        Relative,          // Họ hàng
        Other              // Khác
    }
}
