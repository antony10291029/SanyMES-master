﻿using System;
using Newtonsoft.Json;

namespace Infrastructure
{
    public class GuidConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType.IsAssignableFrom(typeof(Guid));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            Guid result = Guid.Empty;
            if (reader.Value == null) return result;
            Guid.TryParse(reader.Value.ToString(), out result);
            return result;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
    }

    public class DecimalConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType.IsAssignableFrom(typeof(decimal));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            decimal result = 0;
            if (reader.Value == null) return result;
            decimal.TryParse(reader.Value.ToString(), out result);
            return result;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
        /// <summary>
        /// 将JSON转字符串(包括数组)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static T JsonConvertObject<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}