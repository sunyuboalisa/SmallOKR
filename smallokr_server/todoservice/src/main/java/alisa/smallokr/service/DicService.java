package alisa.smallokr.service;

import java.util.List;
import alisa.smallokr.entity.DicEntry;

public interface DicService {
    public List<DicEntry> getDicEntrys(String dicName);
}
