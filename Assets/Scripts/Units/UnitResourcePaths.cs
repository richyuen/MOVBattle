using System.Text;

namespace MOVBattle.Units
{
    public static class UnitResourcePaths
    {
        public static string ToResourceSafeId(string unitId)
        {
            if (string.IsNullOrWhiteSpace(unitId))
            {
                return "unit_placeholder";
            }

            var sb = new StringBuilder(unitId.Length);
            for (int i = 0; i < unitId.Length; i++)
            {
                char c = unitId[i];
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '_')
                {
                    sb.Append(c);
                }
                else
                {
                    sb.Append('_');
                }
            }

            return sb.ToString();
        }

        public static string UnitPrefabResourcePath(string unitId)
        {
            return $"Units/{ToResourceSafeId(unitId)}";
        }
    }
}
