using PopulateEnrollmentCSVFiles;
using System;

public class PopulateEnrollmentCSVFilesProgram
{
    // path to the insurance enrollments folder
    private const string InsuranceEnrollmentDirectoryPath = "D:\\availity-assignment\\PopulateEnrollmentCSVFiles";
    public static void Main()
    {
        EnrollmentHelper.PopulateFolderAsync(InsuranceEnrollmentDirectoryPath).Wait();
    }
}