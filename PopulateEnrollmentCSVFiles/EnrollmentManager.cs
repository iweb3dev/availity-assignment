using System.Text;

namespace PopulateEnrollmentCSVFiles;

internal static class EnrollmentHelper
{
    public static async Task PopulateFolderAsync(string path)
    {
        DirectoryInfo folder = new DirectoryInfo(path);
        FileInfo[] files = folder.GetFiles();
        foreach (FileInfo file in files)
        {
            if (file.Extension.ToLower() == ".csv")
            {
                await PopulateCSVFileAsync(file);
            }
        }
    }
    public static async Task PopulateCSVFileAsync(FileInfo fi)
    {
        var insurances = await ExtractDataFromFile(fi);
        await SaveFilesAsync(insurances, fi);
    }

    private static async Task<Dictionary<string, Dictionary<string, Enrollment>>> ExtractDataFromFile(FileInfo fi)
    {
        Dictionary<string, Dictionary<string, Enrollment>> insurances = new();
        using (var reader = new StreamReader(fi.FullName))
        {
            bool isFirstLine = true;
            List<string> headers = new List<string>();
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (isFirstLine)
                {
                    headers = line!.Split(',').ToList();
                    isFirstLine = false;
                }
                else
                {
                    List<string> components = line!.Split(',').ToList();
                    Enrollment enrollment = new();
                    for (int i = 0; i < components.Count; i++)
                    {
                        var header = headers[i].ToLower();
                        if (header == "user id")
                        {
                            enrollment.UserID = components[i];
                        }
                        else if (header == "first name")
                        {
                            enrollment.FirstName = components[i];
                        }
                        else if (header == "last name")
                        {
                            enrollment.LastName = components[i];
                        }
                        else if (header == "version")
                        {
                            enrollment.Version = Convert.ToInt32(components[i]);
                        }
                        else if (header == "insurance company")
                        {
                            enrollment.InsuranceCompany = components[i];
                        }
                    }
                    if (!insurances.ContainsKey(enrollment.InsuranceCompany!))
                    {
                        insurances.Add(enrollment.InsuranceCompany!, new());
                    }
                    if (!insurances[enrollment.InsuranceCompany!].ContainsKey(enrollment.UserID!))
                    {
                        insurances[enrollment.InsuranceCompany!].Add(enrollment.UserID!, enrollment);
                    }
                    else if (insurances[enrollment.InsuranceCompany!][enrollment.UserID!].Version < enrollment.Version)
                    {
                        insurances[enrollment.InsuranceCompany!][enrollment.UserID!] = enrollment;
                    }
                }
            }
        }
        return insurances;
    }

    public static async Task SaveFilesAsync(Dictionary<string, Dictionary<string, Enrollment>> data, FileInfo file)
    {
        foreach (var item in data)
        {
            StringBuilder content = new StringBuilder();
            content.AppendLine("User Id,First Name,Last Name,Version,Insurance Company");
            var enrolllments = item.Value.Values.OrderBy(x => x.LastName).ThenBy(x => x.FirstName);
            foreach (var enroll in enrolllments)
            {
                content.AppendLine($"{enroll.UserID},{enroll.FirstName},{enroll.LastName},{enroll.Version},{enroll.InsuranceCompany}");
            }

            var filename = $"{file.DirectoryName}/{Path.GetFileNameWithoutExtension(file.Name)}/{Path.GetFileNameWithoutExtension(file.Name)}_{item.Key}.csv";
            if (!Directory.Exists(Path.GetDirectoryName(filename)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filename)!);
            }
            if (File.Exists(filename))
            {
                File.Delete(filename);
            }
            await File.WriteAllTextAsync(filename, content.ToString());
        }
    }
}
