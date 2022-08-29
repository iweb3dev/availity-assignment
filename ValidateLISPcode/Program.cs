using System;

public class ValidateLISPCodeProgram
{
    public static bool validateLISPcode(string code)
    {
        int startedCount = 0;
        for (int i = 0; i < code.Length; i++)
        {
            if (i == 0)
            {
                if (code[i] != '(')
                {
                    return false;
                }
                else
                {
                    startedCount++;
                }
            }
            else if (i < code.Length - 1)
            {
                if (code[i] == '(')
                {
                    startedCount++;
                }
                else if (code[i] == ')')
                {
                    if (startedCount == 0) 
                        return false;
                    startedCount--;
                }
            }
            else if (code[i] != ')' || startedCount != 1)
                return false;
        }
        return true;
    }

    public static void Main()
    {
        Console.WriteLine(validateLISPcode("(+ 7 9 11)")); //True
        Console.WriteLine(validateLISPcode("(write (+ 7 9 11))")); //True
        Console.WriteLine(validateLISPcode("(/ (* a (+ b c) ) d)")); //True
        Console.WriteLine(validateLISPcode("((/ (* a (+ b c) ) d)")); //False
        Console.WriteLine(validateLISPcode("((/ (* a (+ b c) ) d)))")); //False
    }
}